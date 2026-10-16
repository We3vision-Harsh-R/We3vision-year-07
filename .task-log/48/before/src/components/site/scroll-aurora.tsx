"use client";

import { useEffect, useRef } from "react";

// The soft gradient of the hero screens (violet and pink-violet lights) as the background of the WHOLE site: three big lights stand behind every page
// in the fixed background, and they drift slowly while the page is scrolled (--p = how far down the page, 0..1), so the colour travels with the
// visitor and changes from section to section. It is one fixed layer: it never has an edge, and only three transforms change. The look is in
// globals.css (.au-*). Visitors who prefer less motion get the lights standing still.
export function ScrollAurora() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="au" aria-hidden>
      <i className="au-l au-l1" />
      <i className="au-l au-l2" />
      <i className="au-l au-l3" />
    </div>
  );
}
