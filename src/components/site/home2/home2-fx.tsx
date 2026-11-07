"use client";

import { useEffect } from "react";

// The scroll life of "Home 2" (/home-2). No timers and no per-frame React: one passive scroll listener writes three numbers on the page root, and the
// CSS (styles/home-2.css, prefix hb2-) moves things with transform/opacity only.
//   --hp  0..1  how far the first screen has scrolled away (the arch, the dunes and the words drift)
//   --dp  0..1  how far the glowing disc section has travelled through the screen
//   data-in     set on every [data-r] block the first time it comes into view (it rises and fades in)
// The smooth feel itself comes from Lenis (components/site/smooth-scroll.tsx), which the site layout already runs. Reduced motion: nothing moves.
export function Home2Fx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hb2");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = root.querySelector<HTMLElement>(".hb2-hero");
    const disc = root.querySelector<HTMLElement>(".hb2-s1");
    root.setAttribute("data-fx", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    root.querySelectorAll("[data-r]").forEach((el) => io.observe(el));

    let raf = 0;
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      if (hero) root.style.setProperty("--hp", clamp(window.scrollY / Math.max(1, hero.offsetHeight)).toFixed(3));
      if (disc) {
        const r = disc.getBoundingClientRect();
        root.style.setProperty("--dp", clamp((vh - r.top) / (vh + r.height)).toFixed(3));
      }
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
      io.disconnect();
      root.removeAttribute("data-fx");
    };
  }, []);
  return null;
}
