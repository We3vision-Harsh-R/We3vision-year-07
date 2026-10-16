"use client";

import { useEffect, useId, useRef, useState } from "react";

type Step = { title: string; text: string; points?: string };

const lines = (s?: string) =>
  (s ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const STEP = 380; // distance between two pads on the floor (px in the floor plane)
const FLOOR_W = 1400;
const padX = (i: number) => (i % 2 ? 1 : -1) * (120 + ((i * 53) % 90));
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

// The "How we build" process on a 3D floor. On a desktop the stage is pinned while the page scrolls: a glowing path winds over a floor in
// perspective, every step is a pad on it with a small standing sign, and the scroll walks along the path (every step stops for a moment, so
// it can be read). Next to the floor are a list of the steps (click to jump) and a flat, large reading panel with the text and the points of
// the current step. On a tablet, a phone and for visitors who prefer less motion there is no 3D: a clear vertical list of the same steps.
// The real content is the list (read by screen readers); the 3D stage is decoration.
export function ProcessFloor({ items }: { items: Step[] }) {
  const n = items.length;
  const uid = useId();
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // the page scroll walks along the path
  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || n < 2) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let target = 0;
    let cur = -1;
    let lastT = 0;
    let last = -1;
    // the camera follows the scroll with a soft glide (it eases towards where the scroll says it should be)
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000 || 0.016));
      lastT = now;
      if (cur < 0) cur = target;
      cur += (target - cur) * (1 - Math.exp(-dt * 8));
      if (Math.abs(target - cur) < 0.0006) cur = target;
      sticky.style.setProperty("--f", cur.toFixed(4));
      if (barRef.current) barRef.current.style.transform = `scaleY(${(cur / (n - 1)).toFixed(4)})`;
      const idx = Math.round(cur);
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
      if (cur !== target) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const dist = Math.max(1, r.height - sticky.offsetHeight);
      const p = Math.min(1, Math.max(0, (top - r.top) / dist));
      const seg = p * (n - 1);
      const i = Math.min(n - 2, Math.floor(seg));
      // every step holds for a while at its pad, the walk to the next one happens in the middle of its part of the scroll
      target = p >= 1 ? n - 1 : i + smooth((seg - i - 0.3) / 0.4);
      if (!raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  // jump to a step: scroll the page to the place where that step is shown
  const goTo = (i: number) => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;
    const to = Math.min(n - 1, Math.max(0, i));
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const dist = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    const y = track.getBoundingClientRect().top + window.scrollY - top + (to / (n - 1)) * dist;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  // the floor: a path through the pads (all in floor coordinates)
  const H = (n + 1) * STEP + 700;
  const pts = items.map((_, i) => ({ x: FLOOR_W / 2 + padX(i), y: H - 460 - i * STEP }));
  const first = pts[0];
  const last = pts[n - 1];
  let d = `M ${FLOOR_W / 2} ${H + 200} C ${FLOOR_W / 2} ${H - 40} ${first.x} ${first.y + 200} ${first.x} ${first.y}`;
  for (let i = 1; i < n; i++) d += ` C ${pts[i - 1].x} ${pts[i - 1].y - STEP / 2} ${pts[i].x} ${pts[i].y + STEP / 2} ${pts[i].x} ${pts[i].y}`;
  d += ` C ${last.x} ${last.y - 220} ${FLOOR_W / 2} ${last.y - 300} ${FLOOR_W / 2} ${last.y - 700}`;

  const cur = items[active] ?? items[0];
  const stateOf = (i: number) => (i < active ? "past" : i === active ? "active" : i === active + 1 ? "next" : "far");

  return (
    <div ref={trackRef} className="pf-track" style={{ "--n": n } as React.CSSProperties}>
      {/* the real content: a vertical list (the only thing shown on a tablet and a phone) */}
      <ol className="pf-list">
        {items.map((s, i) => (
          <li key={i}>
            <span className="pf-l-no">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {lines(s.points).length > 0 && (
                <ul>
                  {lines(s.points).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div ref={stickyRef} className="pf-sticky" aria-hidden>
        <div className="pf-stage">
          <div className="pf-horizon" />
          <div className="pf-scene">
            <div className="pf-world" style={{ width: FLOOR_W, height: H, marginLeft: -FLOOR_W / 2 }}>
              <div className="pf-grid" />
              <svg className="pf-path" width={FLOOR_W} height={H} viewBox={`0 0 ${FLOOR_W} ${H}`}>
                <path d={d} className="pf-road" />
                <path d={d} className="pf-dash" />
              </svg>
              {items.map((s, i) => (
                <div key={i} className="pf-pad" data-s={stateOf(i)} style={{ left: pts[i].x - 115, top: pts[i].y - 115 }}>
                  <span className="pf-ring" />
                  <span className="pf-no">{String(i + 1).padStart(2, "0")}</span>
                  <div className="pf-bb">
                    <b>{s.title}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pf-ui">
            {/* the steps (click to jump) */}
            <nav className="pf-rail" aria-label="Process steps">
              <span className="pf-rail-bar">
                <span ref={barRef} />
              </span>
              <ol>
                {items.map((s, i) => (
                  <li key={i}>
                    <button type="button" data-on={i === active} data-done={i < active} onClick={() => goTo(i)} aria-controls={`${uid}-panel`} tabIndex={-1}>
                      <i>{String(i + 1).padStart(2, "0")}</i>
                      <span>{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            {/* the reading panel */}
            <div id={`${uid}-panel`} className="pf-panel card-glass">
              <div key={active} className="pf-p-in">
                <p className="pf-p-top">
                  <span>
                    Step {active + 1} of {n}
                  </span>
                </p>
                <h3>{cur.title}</h3>
                <p className="pf-p-text">{cur.text}</p>
                {lines(cur.points).length > 0 && (
                  <>
                    <b className="pf-p-label">What happens in this step</b>
                    <ul>
                      {lines(cur.points).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className="pf-p-nav">
                <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous step" tabIndex={-1}>
                  <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                </button>
                <span>Scroll or use the arrows</span>
                <button type="button" onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label="Next step" tabIndex={-1}>
                  <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
