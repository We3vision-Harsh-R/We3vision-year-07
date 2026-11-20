"use client";

import { useEffect, useRef } from "react";
import "@/styles/home-footer-glow.css";

// GTA theme (task 157): the end of the page is a "Mission passed" banner at the top of the footer. It plays once, the first time it is mostly on screen
// (the letters close up, a light streak crosses it), at the same time as the seven stars at the top right flash. Styles: home-footer-glow.css (fw-).
export function HomeMissionBanner() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="fw-band">
      <p className="fw-pass">Mission passed</p>
      <p className="fw-thanks">Thanks for scrolling all the way down.</p>
    </div>
  );
}
