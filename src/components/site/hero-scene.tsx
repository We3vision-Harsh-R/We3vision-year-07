"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AiChat } from "./ai-chat";
import { clamp } from "./anim-utils";
import { ICONS } from "./icons";
import { ParticleSphere } from "./particle-sphere";
import { SmartLink } from "./smart-link";

type Card = { title: string; href: string; summary: string; subs: string };

// Accent colour of each service (taken from the old site's pastel palette and the violet of the new design)
const ACCENTS = ["hsl(calc(var(--th) + 76) calc(81.25% * var(--ts)) 87.45%)", "hsl(calc(var(--th) + 316) calc(66.15% * var(--ts)) 87.25%)", "hsl(calc(var(--th) + 354) calc(100% * var(--ts)) 76.47%)", "hsl(calc(var(--th) + 358) calc(100% * var(--ts)) 92.16%)", "hsl(calc(var(--th) + 339.48) calc(100% * var(--ts)) 77.45%)", "hsl(calc(var(--th) + 40) calc(40.82% * var(--ts)) 80.78%)", "hsl(calc(var(--th) + 339.6) calc(100% * var(--ts)) 82.55%)"];

// The first 110vh of the scroll (about two flicks of the wheel) are the ball, the blast, the dots fading away and the boxes
// dropping in (PE_END of the whole track); the rest of the track is the walk of the little guide along the services.
const FIRST_VH = 110;
const WALK_VH = 150;
const PE_END = FIRST_VH / (FIRST_VH + WALK_VH);
// scroll progress (of that first part) at which the particle blast is over (the sphere finishes its own 0..1 animation here)
const BLAST_END = 0.4;
// once the last box has dropped in (the boxes finish at about 0.84), the rail and the lines of the first service come down together;
// the guide only comes in on the NEXT scroll, when the second part of the track starts (w > ENTER_W)
const REVEAL_PE = 0.86;
const ENTER_W = 0.004;
const WALK_SPEED = 380; // top speed of the guide, px per second

const oneLine = (t: string) => t.replace(/\s*\n\s*/g, " ").trim();

// "Name | short description | optional link" per line (up to 4 lines)
const parseSubs = (raw: string) =>
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((l) => {
      const [name = "", desc = "", href = ""] = l.split("|").map((x) => x.trim());
      return { name, desc, href };
    });

// The hero is a tall "track" with a screen-sized scene pinned (sticky) inside it. While you scroll along the track the
// page does NOT move: the ball, the 7 and the two texts break into particles (a few of them settle in small heaps at the
// left and right edge), then the seven service boxes drop in one after another in a single small row at the top.
// Then a tiny guide walks in under the first box and, while you keep scrolling, walks along the row to the last one: the box
// it stands under gets its border and that service opens below (sub-services with a short description). Scrolling back
// up makes it walk back to the previous service. Pointing at a box sends the guide to that box. When the track ends, the next
// section scrolls up as normal.
//   progress p (0 → 1) is smoothed; pe (its first part) goes to the canvas ("hero-progress" event) and to the boxes (CSS
//   variable --p); w (its second part) moves the guide.
export function HeroScene({ mark, above, below, cards }: { mark: string; above: string; below: string; cards: Card[] }) {
  const trackRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const avRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const peRef = useRef(0);
  const wRef = useRef(0);
  const hoverRef = useRef<number | null>(null); // a box the visitor points at: the guide goes there until the next scroll
  const [ready, setReady] = useState(false); // boxes are visible enough to be used
  const [chatOn, setChatOn] = useState(false); // the AI chat bar has faded in
  const [stageIn, setStageIn] = useState(false); // the rail and the lines of the first service have come down
  const [active, setActive] = useState<number | null>(null); // the service that is open (the one the guide stands under)

  useEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    if (!track || !scene) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let target = 0;
    let p = 0;
    let lastP = 0;
    let isReady = false;
    let isChat = false;
    let isIn = false;
    let lastPStr = "";
    let raf = 0;
    let last = 0;

    let frozen = false; // development only: keeps the position set by __sceneSeek
    const read = () => {
      if (frozen) return;
      const r = track.getBoundingClientRect();
      const distance = r.height - window.innerHeight;
      target = distance > 0 ? clamp(-r.top / distance) : 0;
    };
    const apply = () => {
      const pe = Math.min(1, p / PE_END);
      peRef.current = pe;
      wRef.current = clamp((p - PE_END) / (1 - PE_END));
      if (Math.abs(p - lastP) > 0.0008) hoverRef.current = null; // scrolling takes the guide over again
      lastP = p;
      const pStr = pe.toFixed(4);
      if (pStr !== lastPStr) {
        lastPStr = pStr; // (the same value again would still make the browser re-style every box)
        scene.style.setProperty("--p", pStr);
      }
      // the particle blast (ball + 7) plays during the first part of the scroll only; the boxes come after it has finished
      window.dispatchEvent(new CustomEvent("hero-progress", { detail: clamp(pe / BLAST_END) }));
      window.dispatchEvent(new CustomEvent("hero-raw", { detail: pe })); // the particles feel every scroll
      const nowReady = pe > 0.45;
      if (nowReady !== isReady) {
        isReady = nowReady;
        setReady(nowReady);
      }
      const nowIn = pe > REVEAL_PE;
      if (nowIn !== isIn) {
        isIn = nowIn;
        setStageIn(nowIn);
      }
      const nowChat = pe > 0.44;
      if (nowChat !== isChat) {
        isChat = nowChat;
        setChatOn(nowChat);
      }
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (p === target) return;
      p = Math.abs(target - p) < 0.0004 ? target : p + (target - p) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.22));
      apply();
    };

    read();
    p = target; // start in the right state (also when the page is reloaded half-way down)
    apply();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    raf = requestAnimationFrame(loop);

    if (process.env.NODE_ENV !== "production") {
      // development helper: jump to a scroll position of the whole track (hidden browser panes do not run animation frames)
      (window as unknown as { __sceneSeek?: (v: number) => void }).__sceneSeek = (v) => {
        frozen = true;
        target = p = v;
        hoverRef.current = null;
        apply();
        (window as unknown as { __sphereSeek?: (t: number) => void }).__sphereSeek?.(10);
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  // The guide: walks along the row under the boxes. Where it stands decides which service is open.
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const av = avRef.current;
    if (!track || !stage || !av) return;
    const n = cards.length;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ax = 0; // x of the guide, in the coordinates of the stage
    let vel = 0; // its speed, px per second (it speeds up and slows down smoothly)
    let shown = false; // is the guide on the screen (it fades in out of a blur and fades out into one)
    let face = "right";
    let idx: number | null = null;
    let lastIdx: number | null = null;
    let raf = 0;
    let last = 0;
    let onScreen = true;

    // where the boxes are (x of their centres in the coordinates of the stage). Measured only when the size changes, never
    // per frame: reading positions in every frame forces the browser to lay the page out again each time.
    let centers: number[] = [];
    const measure = () => {
      centers = itemRefs.current.slice(0, n).map((li) => (li ? li.offsetLeft - stage.offsetLeft + li.offsetWidth / 2 : 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    document.fonts.ready.then(measure, measure);
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { rootMargin: "200px" });
    io.observe(track);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!onScreen) return; // the hero is not on the screen

      const pe = peRef.current;
      const w = wRef.current;
      if (centers.length === 0) return;

      // which service does the guide want to be at (fractional while it is between two boxes)?
      let want: number | null = null;
      if (pe > 0.45 && hoverRef.current !== null) want = hoverRef.current;
      else if (pe >= 1 && w > ENTER_W) want = w * (n - 1);

      if (window.innerWidth < 700) {
        // phones: the boxes wrap into two rows, so there is no walk: the scroll (or a tap) just opens the services one by one
        idx = want === null ? (pe > REVEAL_PE ? 0 : null) : Math.round(want);
      } else {
        let tx = ax;
        if (want !== null) {
          const i0 = Math.min(n - 1, Math.max(0, Math.floor(want)));
          const i1 = Math.min(n - 1, i0 + 1);
          tx = centers[i0] + (centers[i1] - centers[i0]) * (want - i0);
        }
        if (want !== null && !shown) {
          // it appears right where it has to be (while it is still invisible), then comes out of the blur
          shown = true;
          ax = tx;
          vel = 0;
          av.dataset.show = "true";
        } else if (want === null && shown) {
          shown = false; // scrolled back up: it blurs out and hides where it stands
          vel = 0;
          av.dataset.show = "false";
        }
        if (shown) {
          // it speeds up, slows down and stops smoothly
          const dx = tx - ax;
          if (reduceMotion) {
            ax = tx;
            vel = 0;
          } else {
            const target = Math.max(-WALK_SPEED, Math.min(WALK_SPEED, dx * 5));
            vel += (target - vel) * (1 - Math.exp(-dt * 9));
            ax += vel * dt;
            if (Math.abs(dx) < 0.6 && Math.abs(vel) < 8) {
              ax = tx;
              vel = 0;
            }
          }
          if (Math.abs(vel) > 10) face = vel > 0 ? "right" : "left";
          av.style.transform = `translateX(${ax.toFixed(1)}px)`;
          av.dataset.state = Math.abs(vel) > 16 ? "walk" : "idle";
          av.dataset.face = face;
          stage.style.setProperty("--ax", `${ax.toFixed(1)}px`);
        }
        // the box it stands under
        // (before the guide walks in, the first service is open)
        idx = shown ? centers.reduce((best, c, i) => (Math.abs(c - ax) < Math.abs(centers[best] - ax) ? i : best), 0) : pe > REVEAL_PE ? 0 : null;
      }

      if (idx !== lastIdx) {
        lastIdx = idx;
        if (idx !== null) stage.style.setProperty("--ac", ACCENTS[idx % ACCENTS.length]);
        setActive(idx);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [cards.length]);

  const goTo = (i: number) => {
    hoverRef.current = i; // the guide walks to this box (until the visitor scrolls)
  };

  return (
    <section ref={trackRef} id="hero" style={{ height: `${FIRST_VH + WALK_VH}vh` }} className="relative">
      <div
        ref={sceneRef}
        data-ready={ready}
        data-active={active !== null}
        data-in={stageIn}
        style={{ "--p": 0 } as CSSProperties}
        className="group/scene sticky top-0 h-screen overflow-hidden"
      >
        {/* the particles: once the services are open they have all faded away, so the canvas is taken off the screen */}
        <div aria-hidden className="pointer-events-none absolute inset-0 group-data-[in=true]/scene:invisible">
          <ParticleSphere mark={mark} above={above} below={below} scale={0.78} />
        </div>

        <div className="hub" data-active={active !== null} inert={!ready}>
          <ul className="hub-row">
            {cards.map((card, i) => {
              const Icon = ICONS[i % ICONS.length];
              const inside = (
                <>
                  <span aria-hidden className="hub-ico">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="hub-name">{card.title}</span>
                </>
              );
              const common = {
                className: "hub-box",
                onFocus: () => goTo(i),
                onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && goTo(i),
              };
              return (
                <li
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-on={active === i}
                  style={{ "--i": i, "--d": active === null ? 0 : Math.abs(i - active), "--ac": ACCENTS[i % ACCENTS.length] } as CSSProperties}
                  className="hub-item"
                >
                  {card.href ? (
                    <SmartLink
                      href={card.href}
                      {...common}
                      onClick={(e) => {
                        // touch screens have no hover: the first tap opens the service, a second tap goes to its page
                        if (!window.matchMedia("(hover: hover)").matches && active !== i) {
                          e.preventDefault();
                          goTo(i);
                        }
                      }}
                    >
                      {inside}
                    </SmartLink>
                  ) : (
                    <button type="button" {...common} onClick={() => goTo(i)}>
                      {inside}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {/* the open service: the guide walks along the rail under the boxes, the sub-services hang below the rail */}
          <div ref={stageRef} className="hub-stage" data-open={active !== null} data-in={stageIn}>
            <span aria-hidden className="hub-rail" style={{ "--n": cards.length } as CSSProperties}>
              {/* the road: a dashed lane that drifts under the line, a light that runs along it and a stop under every box */}
              <i className="hub-dash" />
              <i className="hub-pulse" />
              {cards.map((_, i) => (
                <i key={i} className="hub-tick" data-on={active === i} style={{ "--i": i } as CSSProperties} />
              ))}
            </span>
            <div ref={avRef} className="hub-av" data-show="false" data-state="idle" data-face="right" aria-hidden>
              <div className="hub-av-body">
                <svg viewBox="0 0 28 40" width="28" height="40" fill="none">
                  <defs>
                    <linearGradient id="g-shirt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="hsl(calc(var(--th) + 359.7) calc(100% * var(--ts)) 81.96%)" />
                      <stop offset="1" stopColor="hsl(calc(var(--th) + 344.55) calc(74.36% * var(--ts)) 61.76%)" />
                    </linearGradient>
                    <linearGradient id="g-hair" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="hsl(calc(var(--th) + 351.09) calc(48.18% * var(--ts)) 56.86%)" />
                      <stop offset="1" stopColor="hsl(calc(var(--th) + 347.91) calc(58.02% * var(--ts)) 15.88%)" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="14" cy="38.4" rx="9.5" ry="2.2" fill="rgba(0,0,0,0.38)" />
                  <g className="g-body">
                    {/* the limbs on the far side (darker), the body, then the limbs on the near side */}
                    <g className="g-leg g-back" opacity="0.7">
                      <rect x="12.2" y="23" width="4.4" height="13" rx="2.2" fill="hsl(calc(var(--th) + 346.91) calc(60% * var(--ts)) 10.78%)" />
                      <path d="M11.4 35.2h8.2c1.2 0 2 .8 2 1.8v.5h-10.2z" fill="hsl(calc(var(--th) + 61.45) calc(58.93% * var(--ts)) 78.04%)" />
                    </g>
                    <g className="g-arm g-back" opacity="0.7">
                      <rect x="12.8" y="13.5" width="3.4" height="10.5" rx="1.7" fill="hsl(calc(var(--th) + 343.91) calc(50.59% * var(--ts)) 50%)" />
                      <circle cx="14.5" cy="24" r="1.7" fill="#d9a888" />
                    </g>
                    <rect x="8.2" y="12" width="11.6" height="13.5" rx="4.6" fill="url(#g-shirt)" />
                    <path d="M10 14.2c1.4-.8 3.2-1 5-.6" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="14" cy="7.4" r="6.3" fill="#f4c3a2" />
                    <path d="M7.6 7.6C7.2 2.6 10.6.7 14.4.9c3.6.2 6.1 2.7 5.9 6.4-1.4-1.7-3.7-2.6-6.4-2.4-2.7.2-5 1.1-6.3 2.7z" fill="url(#g-hair)" />
                    <circle cx="12.1" cy="8.2" r="1.1" fill="#d9a888" />
                    <circle cx="18.1" cy="7.9" r="0.95" fill="hsl(calc(var(--th) + 347.91) calc(58.02% * var(--ts)) 15.88%)" />
                    <circle cx="17" cy="10" r="1.2" fill="#f08d9a" opacity="0.55" />
                    <g className="g-leg g-front">
                      <rect x="12.2" y="23" width="4.4" height="13" rx="2.2" fill="hsl(calc(var(--th) + 347.91) calc(58.02% * var(--ts)) 15.88%)" />
                      <path d="M11.4 35.2h8.2c1.2 0 2 .8 2 1.8v.5h-10.2z" fill="hsl(calc(var(--th) + 76) calc(81.25% * var(--ts)) 87.45%)" />
                    </g>
                    <g className="g-arm g-front">
                      <rect x="12.8" y="13.5" width="3.4" height="10.5" rx="1.7" fill="hsl(calc(var(--th) + 348.93) calc(81.6% * var(--ts)) 68.04%)" />
                      <circle cx="14.5" cy="24" r="1.7" fill="#f4c3a2" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            {cards.map((card, i) => {
              const subs = parseSubs(card.subs);
              return (
                <section
                  key={i}
                  data-on={active === i}
                  aria-hidden={active !== i}
                  style={{ "--ac": ACCENTS[i % ACCENTS.length] } as CSSProperties}
                  className="hub-panel"
                >
                  <header className="hub-head">
                    <div>
                      <span className="hub-idx">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="hub-title">{oneLine(card.title)}</h2>
                      {card.summary && <p className="hub-sum">{card.summary}</p>}
                    </div>
                    {card.href && (
                      <SmartLink href={card.href} className="hub-more" tabIndex={active === i ? 0 : -1}>
                        Explore {oneLine(card.title)} <span aria-hidden>→</span>
                      </SmartLink>
                    )}
                  </header>
                  {subs.length > 0 && (
                    <ul className="hub-subs">
                      {subs.map((s, j) => (
                        <li key={j} style={{ "--k": j } as CSSProperties}>
                          <span className="hub-sn">{String(j + 1).padStart(2, "0")}</span>
                          {s.href ? (
                            <SmartLink href={s.href} className="hub-sl" tabIndex={active === i ? 0 : -1}>
                              <h3>{s.name}</h3>
                              {s.desc && <p>{s.desc}</p>}
                            </SmartLink>
                          ) : (
                            <div>
                              <h3>{s.name}</h3>
                              {s.desc && <p>{s.desc}</p>}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        {/* The AI chat: a slim glass bar above the menu (it rises in together with the first service box) that opens into a
            chat box when you point at it */}
        <div className="ai-wrap" inert={!chatOn}>
          <AiChat />
        </div>

        {/* Small bobbing arrow: a hint to scroll. Fades away as soon as you start. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center" style={{ opacity: "clamp(0, calc(1 - var(--p) * 10), 1)" }}>
          <svg viewBox="0 0 24 24" className="animate-bob size-5 fill-none stroke-violet/70" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Anchor for the "Services" menu link: lands where all the boxes are in place */}
      <span id="services" aria-hidden className="absolute left-0 block size-px" style={{ top: `${Math.round(FIRST_VH * 0.9)}vh` }} />
    </section>
  );
}
