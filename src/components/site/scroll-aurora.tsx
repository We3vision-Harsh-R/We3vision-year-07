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
    // a phone / tablet: the lights stand still (no work on every scroll frame; owner 2026-11-07: the phone scroll must be smooth)
    if (window.innerWidth < 1024) return;
    let raf = 0;
    let max = 0; // the scrollable height is read only when the page changes size, never inside the scroll frame
    const size = () => (max = document.documentElement.scrollHeight - window.innerHeight);
    const update = () => {
      raf = 0;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    size();
    update();
    const onSize = () => {
      size();
      schedule();
    };
    const ro = new ResizeObserver(onSize);
    ro.observe(document.body);
    window.addEventListener("resize", onSize);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onSize);
      window.removeEventListener("scroll", schedule);
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
