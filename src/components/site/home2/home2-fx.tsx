"use client";

import { useEffect } from "react";

// The scroll life of "Home 2" (/home-2). No timers and no per-frame React: one passive scroll listener writes three numbers on the page root, and the
// CSS (styles/home-2.css, prefix hb2-) moves things with transform/opacity only.
//   the page opens as a pinned fly-through (.hb2-fly): in through the door of the first screen, out of the centre of the disc (see read() below)
//   data-in     set on every [data-r] block the first time it comes into view (it rises and fades in)
// The smooth feel itself comes from Lenis (components/site/smooth-scroll.tsx), which the site layout already runs. Reduced motion: nothing moves.
export function Home2Fx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hb2");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fly = root.querySelector<HTMLElement>(".hb2-fly");
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
      if (!fly) return;
      const vh = window.innerHeight;
      const r = fly.getBoundingClientRect();
      // p: 0 at the top of the pinned part, 1 when it lets go
      const p = clamp(-r.top / Math.max(1, r.height - vh));
      // phase 1 (p 0..0.5): we fly into the door. The first screen zooms from the centre of the door (accelerating, like a camera moving in)
      const t = clamp(p / 0.5);
      const e1 = Math.pow(t, 1.45);
      // phase 2 (p 0.44..0.9): we come out of the middle of the lit disc and the camera pulls back to the place of the About section
      const u = clamp((p - 0.44) / 0.46);
      const e2 = 1 - Math.pow(1 - u, 3);
      const set = (k: string, v: number) => root.style.setProperty(k, v.toFixed(4));
      set("--hs", Math.pow(26, e1)); // zoom of the first screen
      set("--rs", Math.pow(26, e1 * 0.38)); // the arches around the door rush past faster (depth)
      set("--hp", t); // how far into the door (the words, the stars and the button fade out early)
      set("--ho", 1 - clamp((t - 0.8) / 0.2)); // the first screen fades into the light of the door
      set("--do", clamp((p - 0.42) / 0.1)); // the disc scene fades in from the same light
      set("--ds", Math.pow(9, 1 - e2)); // the disc starts huge (we are inside it) and settles to its size
      set("--tx", clamp((p - 0.8) / 0.14)); // the words of the About part come in last
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
