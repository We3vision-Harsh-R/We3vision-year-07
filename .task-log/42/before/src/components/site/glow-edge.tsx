"use client";

import { useEffect, useRef } from "react";

// The "border glow" of the cards (the idea is React Bits' BorderGlow): when the pointer is near the edge of a card, a soft light in the
// colours of the site follows the pointer along that edge, a coloured border and a faint fill appear on that side, and the card gets a
// glow around it. A card opts in by getting the class `bglow` and this component as its FIRST child; the look is in globals.css (.bglow).
// The component only measures the pointer: it sets --edge-proximity (0..100) and --cursor-angle on its parent card. No re-renders.

export function GlowEdge() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = ref.current?.parentElement;
    if (!card) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;
      const dx = e.clientX - r.left - cx;
      const dy = e.clientY - r.top - cy;
      // how close to the edge: 0 in the middle, 100 on the edge
      const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
      const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (deg < 0) deg += 360;
      card.style.setProperty("--edge-proximity", (edge * 100).toFixed(2));
      card.style.setProperty("--cursor-angle", `${deg.toFixed(2)}deg`);
    };
    card.addEventListener("pointermove", move, { passive: true });
    return () => card.removeEventListener("pointermove", move);
  }, []);

  return <span ref={ref} className="bglow-edge" aria-hidden />;
}
