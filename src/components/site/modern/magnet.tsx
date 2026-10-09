"use client";

import { useRef } from "react";

// A button that leans towards the mouse a little when it comes near (the idea is the Magnet of React Bits, built here without a library).
// Only a transform on one element, only while a mouse is over it; touch screens and visitors who prefer less motion see a plain button.

export function Magnet({ children, strength = 0.28 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.translate = "";
  };
  return (
    <div ref={ref} className="mg" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
