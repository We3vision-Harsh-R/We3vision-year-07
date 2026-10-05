"use client";

import { useEffect, useRef } from "react";
import { shiftRgb } from "./anim-utils";
import { THEME_EVENT, liveTheme } from "@/lib/theme";

/** A few hundred tiny stars drawn once on a canvas (redrawn on resize). Cheap: no animation loop, just a slow CSS twinkle. */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const tc = shiftRgb([211, 135, 255], liveTheme().h, liveTheme().s); // the purple stars follow the theme colour
      let seed = 7; // fixed seed: the same sky on every visit
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const count = Math.min(260, Math.round((w * h) / 9000));
      for (let i = 0; i < count; i++) {
        const x = rnd() * w;
        const y = rnd() * h;
        const r = rnd() * 1.1 + 0.25;
        const alpha = rnd() * 0.6 + 0.15;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = rnd() > 0.7 ? `rgba(${tc[0]},${tc[1]},${tc[2]},${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
    };

    draw();
    let raf = 0;
    const onTheme = () => {
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const tick = () => {
        draw();
        if (performance.now() - t0 < 1100) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("resize", draw);
    window.addEventListener(THEME_EVENT, onTheme);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", draw);
      window.removeEventListener(THEME_EVENT, onTheme);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="animate-twinkle absolute inset-0 size-full" />;
}
