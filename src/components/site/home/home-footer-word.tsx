"use client";

import { useEffect, useRef } from "react";
import "@/styles/home-footer-glow.css";

// The big "We3vision" word of the footer (task 157, GTA theme, lib/gta.ts GTA_ON): a neon sunset glow that follows the cursor. Two copies of the word (the
// ::before bloom and the ::after crisp neon with sun stripes, home-footer-glow.css prefix fw-) are shown through a round mask that sits where the cursor is
// (--fx / --fy, in px from the top left of the word, --fo = how strongly). The light glides after the cursor with a soft lag. When the cursor is not in
// the footer, the light patrols along the word by itself. Only while the footer is on screen, only with a mouse (hover + fine pointer), and the patrol is
// off for visitors who prefer less motion. The text is aria-hidden (decoration), as before.
export function HomeFooterWord() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    const foot = el?.closest("footer");
    if (!el || !foot) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let vis = false;
    let inside = false;
    let leftAt = -1e9; // when the cursor left the footer (the patrol starts 1.4 s later)
    let cx = 0;
    let cy = 0;
    let x = 0;
    let y = 0;
    let o = 0;
    let ready = false;
    const frame = (now: number) => {
      raf = 0;
      if (!vis) return;
      const r = el.getBoundingClientRect();
      let tx = x;
      let ty = y;
      let to = 0;
      if (inside) {
        tx = cx - r.left;
        ty = cy - r.top;
        to = 1;
      } else if (!reduce && now - leftAt > 1400) {
        const t = ((now / 1000) % 9) / 9; // one patrol takes 9 s
        tx = (-0.1 + 1.2 * t) * r.width;
        ty = r.height * (0.3 + 0.08 * Math.sin(t * 14));
        to = 0.85;
      }
      if (!ready) {
        x = tx;
        y = ty;
        ready = true;
      }
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      o += (to - o) * 0.07;
      el.style.setProperty("--fx", `${x.toFixed(1)}px`);
      el.style.setProperty("--fy", `${y.toFixed(1)}px`);
      el.style.setProperty("--fo", o.toFixed(3));
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && vis) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: Event) => {
      const p = e as PointerEvent;
      cx = p.clientX;
      cy = p.clientY;
      inside = true;
    };
    const onLeave = () => {
      inside = false;
      leftAt = performance.now();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        vis = e.isIntersecting;
        if (vis) start();
      },
      { threshold: 0 },
    );
    io.observe(foot);
    foot.addEventListener("pointermove", onMove);
    foot.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      foot.removeEventListener("pointermove", onMove);
      foot.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <p ref={ref} className="hb2-f-big fw" aria-hidden data-t="We3vision">
      We3vision
    </p>
  );
}
