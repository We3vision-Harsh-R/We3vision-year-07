"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A row of cards that you swipe sideways (instead of a long stack): each card snaps, the next one peeks in from the right, and small dots show where you
 * are (tap a dot to jump). Every card is in the page, so nothing is hidden from search engines. On a tablet the cards are shown in a grid instead.
 */
export function Carousel({ children, label, wide }: { children: ReactNode; label?: string; wide?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const items = Children.toArray(children);
  const n = items.length;

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el || n < 2) return;
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + 12 : el.clientWidth;
    setI(Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / step))));
  }, [n]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let f = 0;
    const on = () => {
      if (!f) f = requestAnimationFrame(() => { f = 0; onScroll(); });
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => { el.removeEventListener("scroll", on); if (f) cancelAnimationFrame(f); };
  }, [onScroll]);

  const go = (k: number) => {
    const el = track.current;
    const child = el?.children[k] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className={`ma-car${wide ? " is-wide" : ""}`} role="group" aria-roledescription="carousel" aria-label={label}>
      <div ref={track} className="ma-car-track">
        {items.map((c, k) => (
          <div key={k} className="ma-car-i" role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`}>
            {c}
          </div>
        ))}
      </div>
      {n > 1 && (
        <div className="ma-car-dots" aria-hidden="false">
          {items.map((_, k) => (
            <button key={k} type="button" className={k === i ? "is-on" : ""} aria-label={`Go to ${k + 1} of ${n}`} aria-current={k === i} onClick={() => go(k)} />
          ))}
        </div>
      )}
    </div>
  );
}
