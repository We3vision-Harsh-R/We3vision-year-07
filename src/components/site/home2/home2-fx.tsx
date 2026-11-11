"use client";

import { useEffect } from "react";

// The scroll life of "Home 2" (/home-2). One passive scroll listener; the picture is written straight onto the few elements that move (transform and
// opacity only). Nothing is written on the page root, because a changed custom property there would restyle every element of the page on every frame.
//   the page opens as a pinned fly-through (.hb2-fly): in through the door of the first screen, out of the centre of the disc
//   data-in     set on every [data-r] block the first time it comes into view (it rises and fades in)
// The smooth feel comes from Lenis (components/site/smooth-scroll.tsx), which the site layout already runs: the picture follows the scroll exactly,
// with no second smoothing on top (two layers of easing made the zoom feel late and floaty). Reduced motion: nothing moves.
export function Home2Fx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hb2");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // phones and small screens: one column, no pinned fly-through (the page is plain scrolling; see the max-width 900px block in home-2.css)
    const phone = window.matchMedia("(max-width: 900px)").matches;
    const fly = phone ? null : root.querySelector<HTMLElement>(".hb2-fly");
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

    // a light that follows the mouse on the cards (written on the one card under the mouse only)
    let lit: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const c = (e.target as HTMLElement | null)?.closest<HTMLElement>(".hb2-m-bc, .hb2-card");
      if (c !== lit) lit = c ?? null;
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
      c.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    // buttons lean a little towards the mouse (magnetic) and come back when it leaves
    let mag: HTMLElement | null = null;
    const onMag = (e: PointerEvent) => {
      const b = (e.target as HTMLElement | null)?.closest<HTMLElement>(".hb2-m-btn");
      if (mag && mag !== b) mag.style.transform = "";
      mag = b ?? null;
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.transform = `translate3d(${((e.clientX - (r.left + r.width / 2)) * 0.22).toFixed(1)}px,${((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1)}px,0)`;
    };
    root.addEventListener("pointermove", onMag, { passive: true });
    // "Explore": fly through the door on a long eased scroll and land on the About part (instead of a jump to the anchor)
    const onGo = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLElement>(".hb2-go");
      const f = phone ? root.querySelector<HTMLElement>(".hb2-s1") : fly;
      if (!a || !f) return;
      e.preventDefault();
      const y = phone ? f.getBoundingClientRect().top + window.scrollY : f.getBoundingClientRect().top + window.scrollY + (f.offsetHeight - window.innerHeight) * 0.96;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (v: number, o?: { duration?: number; easing?: (t: number) => number }) => void } }).__lenis;
      if (lenis) lenis.scrollTo(y, { duration: phone ? 1.4 : 3, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
      else window.scrollTo({ top: y, behavior: "smooth" });
    };
    root.addEventListener("click", onGo);

    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s);
    const hero = q(".hb2-hero");
    const world = q(".hb2-world");
    const flood = q(".hb2-flood");
    const s1 = q(".hb2-s1");
    const disc = q(".hb2-disc");
    const discWorld = q(".hb2-disc-world");
    const arch = q(".hb2-arch");
    const wish = q(".hb2-wish");
    const heroTexts = (phone ? [q(".hb2-copy"), q(".hb2-lede"), q(".hb2-ph-row"), q(".hb2-ph-stats")] : [q(".hb2-copy"), q(".hb2-lede"), q(".hb2-go")]).filter((x): x is HTMLElement => !!x);
    const aboutTexts = Array.from(root.querySelectorAll<HTMLElement>(".hb2-s1-top > *"));
    let oy = 520; // y of the middle of the door inside the first screen (the vanishing point of the camera)
    let discCy = 600; // y of the middle of the disc inside the pinned screen, when it has settled
    const measure = () => {
      if (arch) oy = arch.offsetTop + arch.offsetHeight / 2;
      if (disc) discCy = disc.offsetTop + disc.offsetHeight * 0.67;
      if (hero) hero.style.perspectiveOrigin = `50% ${oy.toFixed(1)}px`;
    };
    // write a style only when it changed
    const put = (el: HTMLElement | null, prop: "transform" | "opacity" | "filter", v: string) => {
      if (el && el.style[prop] !== v) el.style[prop] = v;
    };
    let lastP = -1;
    const draw = (p: number) => {
      if (p === lastP) return;
      lastP = p;
      const mid = Math.max(window.innerHeight, 780) / 2;
      // phase 1 (p 0..0.52): in through the door, towards the vanishing point in the middle of the door (the door slides to the middle as we go)
      const t = clamp(p / 0.52);
      const ease = 0.55 * t + 0.45 * t * t;
      put(world, "transform", `translate3d(0,0,${(835 * ease).toFixed(1)}px)`);
      put(hero, "transform", `translate3d(0,${((mid - oy) * (t * t * (3 - 2 * t))).toFixed(1)}px,0)`);
      put(hero, "opacity", p < 0.51 ? "1" : "0");
      const text = (1 - t * 4 > 0 ? 1 - t * 4 : 0).toFixed(2);
      for (const el of heroTexts) put(el, "opacity", text);
      // "This year, open your success door": as the door comes close the words blur and vanish (before they could get lost in the light of the door)
      const wk = clamp(t * 3.4);
      put(wish, "opacity", (1 - wk).toFixed(2));
      put(wish, "filter", wk === 0 ? "" : `blur(${(wk * 16).toFixed(1)}px)`);
      // the light of the door: full before the first screen is switched off (no pop), stays a moment, then clears to show the disc from inside
      const fl = p < 0.5 ? clamp((t - 0.55) / 0.4) : p < 0.54 ? 1 : 1 - clamp((p - 0.54) / 0.16);
      put(flood, "opacity", fl.toFixed(2));
      // phase 2 (p 0.5..0.92): out of the middle of the disc; the camera slides back and the disc slides from the middle to its place
      const u = clamp((p - 0.5) / 0.42);
      const e2 = 1 - Math.pow(1 - u, 3);
      put(s1, "opacity", p > 0.5 ? "1" : "0");
      put(discWorld, "transform", `translate3d(0,0,${(690 * (1 - e2)).toFixed(1)}px)`);
      put(disc, "transform", `translate3d(0,${((mid - discCy) * (1 - e2)).toFixed(1)}px,0)`);
      const tx = clamp((p - 0.84) / 0.12).toFixed(2);
      for (const el of aboutTexts) put(el, "opacity", tx);
    };
    // slow drifts tied to the scroll: the tile grid floats up and down
    
    const tiles = q(".hb2-m-grid");
    const drift = (el: HTMLElement | null, x: number, y: number, base: string) => {
      const box = el?.parentElement;
      if (!el || !box) return;
      const r = box.getBoundingClientRect();
      const prog = (innerHeight - r.top) / (innerHeight + r.height);
      if (prog < -0.1 || prog > 1.1) return;
      el.style.transform = `${base} translate3d(${((prog - 0.5) * x).toFixed(1)}px,${((prog - 0.5) * y).toFixed(1)}px,0)`;
    };
    let raf = 0;
    const frame = () => {
      raf = 0;
      drift(tiles, 0, 50, "");
      if (!fly) {
        // phone: walking in through the door while the first screen scrolls away (the door grows and the words fade)
        if (phone && hero) {
          const h = hero.getBoundingClientRect();
          const p = clamp(-h.top / Math.max(1, h.height * 0.85));
          put(world, "transform", p === 0 ? "" : `translate3d(0,${(p * 40).toFixed(1)}px,0) scale(${(1 + p * 0.9).toFixed(3)})`);
          const o = (1 - Math.min(1, p * 1.7)).toFixed(2);
          for (const el of heroTexts) put(el, "opacity", o);
        }
        return;
      }
      const r = fly.getBoundingClientRect();
      draw(clamp(-r.top / Math.max(1, r.height - window.innerHeight)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      measure();
      lastP = -1;
      on();
    };
    measure();
    lastP = -1;
    frame();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointermove", onMag);
      root.removeEventListener("click", onGo);
      cancelAnimationFrame(raf);
      io.disconnect();
      root.removeAttribute("data-fx");
      for (const el of [world, hero, flood, s1, disc, discWorld, wish, ...heroTexts, ...aboutTexts]) el?.removeAttribute("style");
    };
  }, []);
  return null;
}
