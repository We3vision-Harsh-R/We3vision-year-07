"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Globe } from "./globe";

type Place = { label: string; lat: number; lng: number };

// GLOBAL REACH of the home page (redesign 2026-11-04). The globe stays on the screen and the places are a list of big lines next to it, the head
// office first. On a laptop the section is pinned and the page scroll walks down the list: the globe turns to every country in turn and holds it
// lit, so a visitor stays here and sees the whole world of the company. A click on a name turns the globe there too. On a phone and a tablet
// nothing is pinned: the globe is on top, the names are chips under it and a tap turns the globe to that place; until the first tap the globe goes
// round by itself, as it always did. Without motion (reduced motion) nothing is pinned.
const stamp = () => Date.now();
const pad = (n: number) => String(n).padStart(2, "0");

export function ReachStage({ places, head, text, button }: { places: Place[]; head: ReactNode; text: string; button?: ReactNode }) {
  const n = places.length;
  const [at, setAt] = useState<number | undefined>(undefined);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const manual = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || n < 2) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const read = () => {
      raf = 0;
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const dist = Math.max(1, r.height - sticky.offsetHeight);
      const p = Math.min(1, Math.max(0, -r.top / dist));
      if (stamp() < manual.current) return;
      setAt(Math.min(n - 1, Math.floor(p * n)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  const pick = (i: number) => {
    setAt(i);
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || !window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) return;
    const dist = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    const y = track.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / n) * dist;
    manual.current = stamp() + 1300;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const cur = at === undefined ? undefined : places[at];
  return (
    <div ref={trackRef} className="gr-track" style={{ "--n": n } as React.CSSProperties}>
      <div ref={stickyRef} className="gr-sticky">
        <div className="gr-copy">
          {head}
          <p className="gr-text">{text}</p>
          {button}
          <ol className="gr-list" aria-label="Where we work">
            {places.map((p, i) => (
              <li key={p.label} data-on={at === i} data-hq={i === 0}>
                <button type="button" onClick={() => pick(i)} aria-pressed={at === i}>
                  <i>{pad(i + 1)}</i>
                  <span>{p.label}</span>
                  {i === 0 && <em>Head office</em>}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="gr-globe">
          <div className="gr-halo" aria-hidden />
          <Globe places={places} focus={at} label={`Globe showing ${places.map((p) => p.label).join(", ")}`} />
          <p className="gr-now" aria-live="polite" data-on={!!cur}>
            {cur ? (
              <>
                <b>{cur.label}</b>
                <span>{at === 0 ? "Our head office" : "Clients we work with"}</span>
              </>
            ) : (
              <span>Tap a place to turn the globe</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
