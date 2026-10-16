"use client";

import { useEffect, useRef } from "react";

// "Dappled Light": sunlight falling through swaying leaves onto a wall (the idea is the Dappled Light of React Bits Pro, built here without
// any library). A soft light in the colour of the site lies on the wall; over it a small canvas (320 x 180 pixels, scaled up so that the
// shadows are soft) draws about seventy leaves that sway a little in the wind, so that spots of light slide over the wall between them.
// It draws about 24 times a second, only while it is on the screen, and draws one still picture for visitors who prefer less motion.
// Put it behind content: it is absolutely positioned, does not take clicks and fades out at its edges. The look is in globals.css (.dl-*).

const W = 320;
const H = 180;

// a small seeded random generator, so that the leaves are the same on every visit (and on the server)
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Leaf = { x: number; y: number; s: number; r: number; amp: number; ph: number; sp: number; dx: number };

export function DappledLight({ className = "", seed = 7 }: { className?: string; seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const wrap = box.current;
    if (!cv || !wrap) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const rnd = rng(seed);
    // the leaves hang in clusters along a few branches from the top right
    const leaves: Leaf[] = Array.from({ length: 74 }, (_, i) => {
      const branch = i % 5;
      const bx = 0.25 + branch * 0.17 + rnd() * 0.08;
      return { x: bx + (rnd() - 0.5) * 0.22, y: rnd() * 0.95, s: 0.07 + rnd() * 0.085, r: rnd() * Math.PI * 2, amp: 0.1 + rnd() * 0.22, ph: rnd() * 6.28, sp: 0.5 + rnd() * 0.7, dx: 0.004 + rnd() * 0.012 };
    });
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(6, 2, 12, 0.78)";
      ctx.strokeStyle = "rgba(6, 2, 12, 0.78)";
      for (const l of leaves) {
        const a = l.r + Math.sin(t * l.sp + l.ph) * l.amp;
        const px = (l.x + Math.sin(t * 0.5 + l.ph) * l.dx) * W;
        const py = l.y * H;
        const len = l.s * W * 0.5;
        const wid = len * 0.46;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(a);
        // a leaf: two curves that meet in a point at both ends
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.quadraticCurveTo(0, -wid * 1.6, len, 0);
        ctx.quadraticCurveTo(0, wid * 1.6, -len, 0);
        ctx.fill();
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-len * 1.5, 0);
        ctx.lineTo(-len, 0);
        ctx.stroke();
        ctx.restore();
      }
      // a thick wall of shade on the top and the right, so that the light comes through a gap
      const g = ctx.createLinearGradient(W, 0, W * 0.55, H * 0.6);
      g.addColorStop(0, "rgba(6, 2, 12, 0.85)");
      g.addColorStop(1, "rgba(6, 2, 12, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    draw(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = false;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 41) return;
      last = now;
      draw(now / 1000);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "60px" });
    io.observe(wrap);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [seed]);

  return (
    <div ref={box} className={`dl ${className}`} aria-hidden>
      <span className="dl-light" />
      <canvas ref={ref} width={W} height={H} className="dl-leaves" />
    </div>
  );
}
