"use client";

import { useEffect, useRef, useState } from "react";
import { GlowEdge } from "../glow-edge";
import { IconTile } from "../icons";
import { SmartLink } from "../smart-link";

// "What we build" as a list and a stage: the services are a list on the left (a row of tabs on a phone), and the one you pick opens as a large
// panel on the right with a small live picture of what that service does (a chat that answers, a chart that predicts, an image that is scanned,
// a loop that keeps a model fresh), then when it is the right choice, the problems it solves and what you get. On a desktop the stage is
// pinned while the page scrolls together with the heading of the section (the chip, the heading and the text stay where they are, so that it
// can be seen which section it is) and the SCROLL opens the boxes one after the other (the open box shows its whole text, the panel shows the
// service). The scroll is compulsory: when it stops the page settles on a box. A click on a box scrolls to it. After the last box the whole
// section goes up with the page. Where it cannot be pinned (a phone, less motion) it moves on by itself while it is on the screen
// and stops as soon as the visitor picks one. The look is in globals.css (.sx-*).

type Card = { title: string; description: string; href?: string; fit?: string; problems?: string; outcomes?: string };
type Scene = "chat" | "chart" | "scan" | "loop" | "orbit";

const lines = (s?: string) => (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
const plain = (s: string) => s.replace(/\s*\n\s*/g, " ");
const sceneOf = (title: string): Scene => {
  const t = title.toLowerCase();
  if (/agent|generative|chat|assistant/.test(t)) return "chat";
  if (/machine|learning|predict|data/.test(t)) return "chart";
  if (/vision|image|video/.test(t)) return "scan";
  if (/mlops|rag|deploy|monitor/.test(t)) return "loop";
  return "orbit";
};
const AUTO_MS = 6500;

function Art({ scene, index }: { scene: Scene; index: number }) {
  if (scene === "chat")
    return (
      <div className="sx-chat">
        <p className="sx-b sx-user" style={{ "--d": "0.15s" } as React.CSSProperties}>
          Where is my order?
        </p>
        <div className="sx-slot">
          <p className="sx-b sx-bot sx-typing" aria-hidden>
            <i />
            <i />
            <i />
          </p>
          <p className="sx-b sx-bot sx-reply">I checked it for you: it is out for delivery and arrives today.</p>
        </div>
        <p className="sx-done">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          Ticket closed, CRM updated
        </p>
      </div>
    );
  if (scene === "chart")
    return (
      <div className="sx-chart">
        <div className="sx-bars">
          {[34, 46, 40, 58, 52, 66, 74, 84].map((h, i) => (
            <span key={i} className="sx-bar" data-p={i > 4} style={{ "--h": `${h}%`, "--i": i } as React.CSSProperties} />
          ))}
          <svg className="sx-trend" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
            <path pathLength={1} d="M4 30 C 22 26, 34 22, 50 18 S 82 8, 96 4" />
          </svg>
        </div>
        <p className="sx-cap">
          <span>What happened</span>
          <span>What is likely next</span>
        </p>
      </div>
    );
  if (scene === "scan")
    return (
      <div className="sx-scan">
        <span className="sx-shape sx-s1" />
        <span className="sx-shape sx-s2" />
        <span className="sx-shape sx-s3" />
        <span className="sx-box sx-x1" style={{ "--d": "1s" } as React.CSSProperties}>
          <em>Item found</em>
        </span>
        <span className="sx-box sx-x2" style={{ "--d": "1.9s" } as React.CSSProperties}>
          <em>Check this one</em>
        </span>
        <span className="sx-sweep" aria-hidden />
      </div>
    );
  if (scene === "loop")
    return (
      <div className="sx-loop">
        <div className="sx-loop-in">
          <span className="sx-ring" aria-hidden />
          <span className="sx-core">Always up to date</span>
          <b className="sx-node sx-n1">Deploy</b>
          <b className="sx-node sx-n2">Monitor</b>
          <b className="sx-node sx-n3">Retrain</b>
          <b className="sx-node sx-n4">Your documents</b>
        </div>
      </div>
    );
  return (
    <div className="sx-orbit">
      <span className="sx-ring sx-ring-a" aria-hidden />
      <span className="sx-ring sx-ring-b" aria-hidden />
      <IconTile index={index + 1} large />
    </div>
  );
}

export function ServiceStage({ cards, head, variant = "stage" }: { cards: Card[]; head?: React.ReactNode; variant?: "stage" | "canvas" }) {
  const n = cards.length;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [pinned, setPinned] = useState(false); // the page scroll drives the boxes
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // where in the track of the page scroll the stage stands: 0 = it has just been pinned .. 1 = the last box is done
  const progress = () => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return { p: 0, dist: 1, top: 0 };
    const r = track.getBoundingClientRect();
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const dist = Math.max(1, r.height - sticky.getBoundingClientRect().height);
    return { p: Math.min(1, Math.max(0, (top - r.top) / dist)), dist, top };
  };

  const pick = (i: number, focus = false) => {
    if (pinned) {
      // the page scrolls to the box (the scroll opens it)
      const { p, dist } = progress();
      const y = window.scrollY + ((i + 0.5) / n - p) * dist;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      if (focus) tabRefs.current[i]?.focus();
      return;
    }
    setAuto(false);
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  // on a desktop (with motion) the stage is pinned and the scroll opens the boxes
  useEffect(() => {
    if (n < 2) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const on = () => setPinned(mq.matches);
    mq.addEventListener("change", on);
    const first = requestAnimationFrame(on);
    return () => {
      mq.removeEventListener("change", on);
      cancelAnimationFrame(first);
    };
  }, [n]);
  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;
    const fit = fitRef.current;
    const lenis = () => (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    // the heading and the stage must be on the screen together: when they are higher than the screen they are made a little smaller (once)
    const size = () => {
      if (fit) {
        fit.style.zoom = "";
        const natural = fit.getBoundingClientRect().height;
        const room = window.innerHeight - 78 - 20;
        fit.style.zoom = natural > room ? String(Math.max(0.7, room / natural)) : "";
      }
      // the track is as high as the stage plus a part of the screen for every box
      track.style.height = `${sticky.getBoundingClientRect().height + n * window.innerHeight * 0.55}px`;
    };
    size();
    document.fonts?.ready.then(size);
    window.addEventListener("resize", size);
    let raf = 0;
    let last = -1;
    const tick = () => {
      raf = 0;
      const { p } = progress();
      const idx = Math.min(n - 1, Math.floor(p * n));
      const q = Math.min(1, p * n - idx);
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
      // how far the open box is (the thin bar at its bottom)
      tabRefs.current[idx]?.style.setProperty("--q", q.toFixed(3));
    };
    // compulsory scroll: when the scrolling stops while the stage is pinned, the page settles on the nearest box (before and after the boxes it is free)
    let snapTimer = 0;
    const snap = () => {
      const { p, dist } = progress();
      if (p <= 0.015 || p >= 0.995) return;
      let to = 0.5 / n;
      let bd = Infinity;
      for (let i = 0; i < n; i++) {
        const pt = (i + 0.75) / n;
        const d = Math.abs(p - pt);
        if (d < bd) {
          bd = d;
          to = pt;
        }
      }
      if (bd * dist < 6) return;
      const y = window.scrollY + (to - p) * dist;
      const l = lenis();
      if (l) l.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(snap, 170);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("resize", size);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearTimeout(snapTimer);
      if (raf) cancelAnimationFrame(raf);
      track.style.height = "";
      if (fit) fit.style.zoom = "";
    };
  }, [pinned, n]);

  // only while it is on the screen (and the visitor has not chosen one) it moves on by itself
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const run = auto && inView && n > 1 && !pinned;
  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [run, active, n]);

  if (n === 0) return null;
  const cur = cards[Math.min(active, n - 1)];
  const fit = (cur.fit ?? "").trim();
  const problems = lines(cur.problems);
  const outcomes = lines(cur.outcomes);
  const scene = sceneOf(plain(cur.title));

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowDown" || k === "ArrowRight") pick((active + 1) % n, true);
    else if (k === "ArrowUp" || k === "ArrowLeft") pick((active - 1 + n) % n, true);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={trackRef} className="sx-track" data-pin={pinned}>
    <div ref={stickyRef} className="sx-sticky">
    <div ref={fitRef} className="sx-fit">
    {head}
    <div className="mx-auto mt-10 w-full max-w-[1180px] px-4">
    {variant === "canvas" ? (
      <div ref={rootRef} className="md cv" data-pin={pinned}>
        {/* a canvas of frames, like a design file: the open frame is selected (corner handles), the others are smaller; the details are in the panel under it */}
        <div className="cv-board" role="tablist" aria-label="What we design" onKeyDown={onKey}>
          <ul className="cv-track" style={{ "--i": active } as React.CSSProperties}>
            {cards.map((c, i) => (
              <li key={i} className="cv-frame" data-on={i === active} data-d={Math.min(3, Math.abs(i - active))}>
                <button
                  type="button"
                  role="tab"
                  id={`sx-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="sx-panel"
                  tabIndex={i === active ? 0 : -1}
                  className="cv-btn"
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  onClick={() => pick(i)}
                >
                  <span className="cv-name">Frame {String(i + 1).padStart(2, "0")}</span>
                  <span className="cv-card">
                    <span className="cv-art" aria-hidden>
                      <IconTile index={i + 1} />
                    </span>
                    <b>{plain(c.title)}</b>
                    <i>{c.description}</i>
                    {i === active && (
                      <>
                        <span className="cv-h cv-h1" aria-hidden />
                        <span className="cv-h cv-h2" aria-hidden />
                        <span className="cv-h cv-h3" aria-hidden />
                        <span className="cv-h cv-h4" aria-hidden />
                      </>
                    )}
                  </span>
                  <span className="cv-dim" aria-hidden>
                    1440 × 900
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div key={active} id="sx-panel" role="tabpanel" aria-labelledby={`sx-tab-${active}`} className="cv-insp">
          <div className="cv-insp-h">
            <span>{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            <h3>{plain(cur.title)}</h3>
            {cur.href && (
              <SmartLink href={cur.href} className="sx-more">
                Read more →
              </SmartLink>
            )}
          </div>
          <div className="cv-insp-cols">
            {fit && (
              <div>
                <h4>Right for you when</h4>
                <p>{fit}</p>
              </div>
            )}
            {problems.length > 0 && (
              <div>
                <h4>Problems it solves</h4>
                <ul>
                  {problems.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {outcomes.length > 0 && (
              <div>
                <h4>What you get</h4>
                <ul>
                  {outcomes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {!fit && problems.length === 0 && outcomes.length === 0 && (
              <div>
                <p>{cur.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
    <div ref={rootRef} className="md sx" data-pin={pinned}>
      <div className="sx-list" role="tablist" aria-label="What we build" onKeyDown={onKey}>
        {cards.map((c, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`sx-tab-${i}`}
            aria-selected={i === active}
            aria-controls="sx-panel"
            tabIndex={i === active ? 0 : -1}
            className="sx-tab"
            data-on={i === active}
            data-run={run}
            onClick={() => pick(i)}
          >
            <span className="sx-tab-no">{String(i + 1).padStart(2, "0")}</span>
            <span className="sx-tab-t">
              <b>{plain(c.title)}</b>
              <i>{c.description}</i>
            </span>
            <span className="sx-tab-bar" aria-hidden />
          </button>
        ))}
      </div>

      <div key={active} id="sx-panel" role="tabpanel" aria-labelledby={`sx-tab-${active}`} className="sx-panel bglow">
        <GlowEdge />
        <div className="sx-art" data-scene={scene} aria-hidden>
          <Art scene={scene} index={active} />
        </div>
        <div className="sx-body">
          <span className="sx-pos" aria-hidden>
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <h3>{plain(cur.title)}</h3>
          {!fit && problems.length === 0 && outcomes.length === 0 && <p className="sx-fit">{cur.description}</p>}
          {fit && (
            <p className="sx-fit">
              <b>Right for you when</b> {fit}
            </p>
          )}
          <div className="sx-cols">
            {problems.length > 0 && (
              <div>
                <h4>Problems it solves</h4>
                <ul>
                  {problems.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {outcomes.length > 0 && (
              <div>
                <h4>What you get</h4>
                <ul>
                  {outcomes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {cur.href && (
            <SmartLink href={cur.href} className="sx-more">
              Read more →
            </SmartLink>
          )}
        </div>
      </div>
    </div>
    )}
    </div>
    </div>
    </div>
    </div>
  );
}
