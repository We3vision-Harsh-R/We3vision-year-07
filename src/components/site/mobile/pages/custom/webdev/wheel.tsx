"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCalm } from "../../../app/use-calm";

/**
 * The industries as the wheel of the iOS pickers: a column of names that turns in 3D (the ones above and below lean away), the middle one sits between
 * two hairlines and its text is shown under the wheel. It turns by itself slowly while it is on the screen; touch it and it is yours (swipe, or tap a
 * name). Native scrolling with snap, so it feels exactly like the system wheel. The same words are in the page for search engines and screen readers.
 */
export type Industry = { name: string; description: string };

const ROW = 46;

let running = 0;
/** scrolls the wheel to `top` with ease-in-out; the snapping is switched off while it moves, so nothing jerks */
function easeTo(el: HTMLElement, top: number, ms = 650) {
  cancelAnimationFrame(running);
  const from = el.scrollTop;
  const delta = top - from;
  if (Math.abs(delta) < 1) return;
  el.style.scrollSnapType = "none";
  const t0 = performance.now();
  const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / ms);
    el.scrollTop = from + delta * ease(k);
    if (k < 1) running = requestAnimationFrame(step);
    else el.style.scrollSnapType = "";
  };
  running = requestAnimationFrame(step);
}

export function IndustryWheel({ items }: { items: Industry[] }) {
  const n = items.length;
  const wheel = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const [at, setAt] = useState(0);
  const [touched, setTouched] = useState(false);
  const [seen, setSeen] = useState(false);
  const calm = useCalm();

  const paint = useCallback(() => {
    const el = wheel.current;
    if (!el) return;
    const pos = el.scrollTop / ROW;
    rows.current.forEach((b, i) => {
      if (!b) return;
      const d = i - pos;
      const a = Math.min(Math.abs(d), 3);
      b.style.transform = `rotateX(${Math.max(-70, Math.min(70, -d * 24))}deg) scale(${1 - a * 0.06})`;
      b.style.opacity = String(Math.max(0.12, 1 - a * 0.34));
    });
    const k = Math.max(0, Math.min(n - 1, Math.round(pos)));
    setAt((p) => (p === k ? p : k));
  }, [n]);

  useEffect(() => {
    const el = wheel.current;
    if (!el) return;
    let f = 0;
    const on = () => { if (!f) f = requestAnimationFrame(() => { f = 0; paint(); }); };
    paint();
    el.addEventListener("scroll", on, { passive: true });
    return () => { el.removeEventListener("scroll", on); if (f) cancelAnimationFrame(f); };
  }, [paint]);

  useEffect(() => {
    const el = wheel.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || touched || calm || n < 2) return;
    let laps = 0;
    const t = window.setInterval(() => {
      const el = wheel.current;
      if (!el) return;
      if (++laps > n) { window.clearInterval(t); return; } // one lap, then it rests (nothing keeps moving for ever)
      const k = Math.round(el.scrollTop / ROW);
      // the last name turns back to the first one the same smooth way (the wheel runs backwards quickly, like a loop)
      easeTo(el, ((k + 1) % n) * ROW, k + 1 >= n ? 900 : 650);
    }, 1000);
    return () => window.clearInterval(t);
  }, [seen, touched, calm, n]);

  const pick = (i: number) => {
    setTouched(true);
    const el = wheel.current;
    if (!el) return;
    if (calm) el.scrollTo({ top: i * ROW });
    else easeTo(el, i * ROW, 600);
  };

  return (
    <div className="mp-wd-wh">
      <div className="mp-wd-wh-box">
        <div className="mp-wd-wh-band" aria-hidden="true" />
        <div
          className="mp-wd-wh-scroll"
          ref={wheel}
          onTouchStart={() => setTouched(true)}
          onPointerDown={() => setTouched(true)}
          onWheel={() => setTouched(true)}
          role="group"
          aria-label="Industries"
          onFocus={() => setTouched(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); pick(Math.min(n - 1, at + 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); pick(Math.max(0, at - 1)); }
          }}
        >
          {items.map((it, i) => (
            <button key={i} ref={(b) => { rows.current[i] = b; }} type="button" aria-pressed={i === at} tabIndex={i === at ? 0 : -1} className="mp-wd-wh-r" onClick={() => pick(i)}>
              {it.name}
            </button>
          ))}
        </div>
      </div>
      <div className="ma-sr">
        {items.map((it, i) => (
          <section key={i}>
            <h3>{it.name}</h3>
            <p>{it.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
