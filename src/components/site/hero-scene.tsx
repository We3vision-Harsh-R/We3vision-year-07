"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AiChat } from "./ai-chat";
import { clamp } from "./anim-utils";
import { ICONS } from "./icons";
import { ParticleSphere } from "./particle-sphere";
import { SmartLink } from "./smart-link";

type Card = { title: string; href: string; summary: string; subs: string };

// Accent colour of each service (taken from the old site's pastel palette and the violet of the new design)
const ACCENTS = ["#f9c5c5", "#c9c9f4", "#d387ff", "#f3d7ff", "#b98cff", "#e2bad2", "#c9a6ff"];

// scroll progress at which the particle blast is over (the sphere finishes its own 0..1 animation at this point)
const BLAST_END = 0.4;

const oneLine = (t: string) => t.replace(/\s*\n\s*/g, " ").trim();

// "Name | short description" per line (up to 4 lines)
const parseSubs = (raw: string) =>
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((l) => {
      const [name, ...rest] = l.split("|");
      return { name: name.trim(), desc: rest.join("|").trim() };
    });

// The hero is a tall "track" with a screen-sized scene pinned (sticky) inside it. While you scroll along the track the
// page does NOT move: the ball, the 7 and the two texts break into particles (a few of them settle in small heaps at the
// left and right edge), then the seven service boxes drop in one after another in a single small row at the top.
// Pointing at a box opens that service: every other box blurs, a thin line runs down from the box and the sub-services
// (each with a short description) appear below it. When the track ends, the next section scrolls up as normal.
//   progress p (0 → 1) is smoothed and sent to the canvas ("hero-progress" event) and to the boxes (CSS variable --p).
export function HeroScene({ mark, above, below, cards }: { mark: string; above: string; below: string; cards: Card[] }) {
  const trackRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [ready, setReady] = useState(false); // boxes are visible enough to be used
  const [chatOn, setChatOn] = useState(false); // the AI chat bar has faded in
  const [active, setActive] = useState<number | null>(null); // the service that is open

  useEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    if (!track || !scene) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let target = 0;
    let p = 0;
    let isReady = false;
    let isChat = false;
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
      scene.style.setProperty("--p", p.toFixed(4));
      // the particle blast (ball + 7) plays during the first part of the scroll only; the boxes come after it has finished
      window.dispatchEvent(new CustomEvent("hero-progress", { detail: clamp(p / BLAST_END) }));
      window.dispatchEvent(new CustomEvent("hero-raw", { detail: p })); // the particles feel every scroll
      const nowReady = p > 0.45;
      if (nowReady !== isReady) {
        isReady = nowReady;
        setReady(nowReady);
      }
      if (p < 0.3) setActive(null); // back at the ball: the boxes are gone, so nothing stays open
      const nowChat = p > 0.44;
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
      p = Math.abs(target - p) < 0.0004 ? target : p + (target - p) * (reduceMotion ? 1 : 1 - Math.exp(-dt / 0.14));
      apply();
    };

    read();
    p = target; // start in the right state (also when the page is reloaded half-way down)
    apply();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    raf = requestAnimationFrame(loop);

    if (process.env.NODE_ENV !== "production") {
      // development helper: jump to a scroll position of the scene (hidden browser panes do not run animation frames)
      (window as unknown as { __sceneSeek?: (v: number) => void }).__sceneSeek = (v) => {
        frozen = true;
        target = p = v;
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

  // the line under the open box follows it: x position and colour are CSS variables of the stage
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || active === null) return;
    const place = () => {
      const item = itemRefs.current[active];
      if (!item) return;
      const s = stage.getBoundingClientRect();
      const b = item.getBoundingClientRect();
      stage.style.setProperty("--nx", `${(b.left + b.width / 2 - s.left).toFixed(1)}px`);
      stage.style.setProperty("--ac", ACCENTS[active % ACCENTS.length]);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // A service that has been opened STAYS open (also while scrolling) until another one is opened; it only resets when you
  // scroll back up to the ball, where the boxes are gone.
  const open = (i: number) => setActive(i);

  return (
    <section ref={trackRef} id="hero" className="relative h-[300vh]">
      <div
        ref={sceneRef}
        data-ready={ready}
        data-active={active !== null}
        style={{ "--p": 0 } as CSSProperties}
        className="group/scene sticky top-0 h-screen overflow-hidden"
      >
        {/* while a service is open the particles step back */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-[opacity,filter] duration-500 group-data-[active=true]/scene:opacity-40 group-data-[active=true]/scene:blur-[3px]"
        >
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
                onFocus: () => open(i),
                onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && open(i),
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
                          open(i);
                        }
                      }}
                    >
                      {inside}
                    </SmartLink>
                  ) : (
                    <button type="button" {...common} onClick={() => open(i)}>
                      {inside}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {/* the open service: a thin line runs down from its box to a rail, the sub-services hang below the rail */}
          <div ref={stageRef} className="hub-stage" data-open={active !== null}>
            <span aria-hidden className="hub-drop" />
            <span aria-hidden className="hub-rail" />
            <span aria-hidden className="hub-node" />
            <p className="hub-hint" aria-hidden>
              Point at a service to see what we build
            </p>
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
                          <div>
                            <h3>{s.name}</h3>
                            {s.desc && <p>{s.desc}</p>}
                          </div>
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
      <span id="services" aria-hidden className="absolute left-0 top-[170vh] block size-px" />
    </section>
  );
}
