"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "@/styles/gta-stars.css";

// GTA theme (task 156): the scroll progress of the page as seven stars (7 stars = 7 years of We3vision), top right. They fill one after the other while
// you scroll; at the very end of the page they all flash in two colours for a few seconds. Loaded as part of LateExtras (own chunk, after the first
// paint), laptop/desktop only, no pointer events. Styles: styles/gta-stars.css (prefix gt-s-). Master switch: lib/gta.ts.
const STAR = "M12 2.4l2.95 6.3 6.85.85-5.05 4.7 1.35 6.8L12 17.6l-6.1 3.5 1.35-6.8L2.2 9.55l6.85-.85z";

export function GtaStars() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(min-width: 1024px)").matches) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const root = document.documentElement;
      const max = Math.max(0, Math.max(root.scrollHeight, document.body.scrollHeight) - window.innerHeight);
      const p = max < 8 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.hide = max < 8 ? "true" : "false";
      el.dataset.end = p > 0.985 ? "true" : "false";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // pages grow after the first paint (images, sections that load later): measure again now and then
    const again = window.setInterval(schedule, 1500);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(again);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className="gt-s" role="img" aria-label="Scroll progress: seven stars, one for every year of We3vision" data-hide="true" data-end="false">
      {Array.from({ length: 7 }, (_, i) => (
        <span key={i} className="gt-s-i" style={{ "--i": i } as CSSProperties}>
          <svg viewBox="0 0 24 24" className="gt-s-off" aria-hidden>
            <path d={STAR} />
          </svg>
          <svg viewBox="0 0 24 24" className="gt-s-on" aria-hidden>
            <path d={STAR} />
          </svg>
        </span>
      ))}
    </div>
  );
}
