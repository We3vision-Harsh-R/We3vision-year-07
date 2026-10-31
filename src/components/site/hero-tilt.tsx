"use client";

import { useEffect } from "react";

/**
 * The brand mark of the Home hero (home-intro.tsx, .hx-art) leans a little against the mouse. This only writes two numbers (--hxx / --hxy, -1..1) on
 * the art, once per frame, and only while the hero is on the screen; CSS (home-intro.css) does the moving. It renders nothing, so the hero itself is
 * plain server HTML. Not for touch screens or reduced motion.
 */
export function HeroTilt() {
  useEffect(() => {
    const art = document.querySelector<HTMLElement>(".hx-art");
    const panel = art?.closest<HTMLElement>(".hx-panel");
    if (!art || !panel) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      art.style.setProperty("--hxx", x.toFixed(3));
      art.style.setProperty("--hxy", y.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      x = (e.clientX / window.innerWidth) * 2 - 1;
      y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) window.addEventListener("pointermove", move, { passive: true });
      else window.removeEventListener("pointermove", move);
    });
    io.observe(panel);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
