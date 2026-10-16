"use client";

import "@/styles/modern-base.css";


import { useEffect, useRef, useState } from "react";
import { SplitHeading } from "./split-heading";

// Small pieces shared by the designs of the repeated sections (the table of which page gets which design is in variant-table.ts).

export const lines = (s?: string) => (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
export const two = (n: number) => String(n).padStart(2, "0");
export const plain = (s: string) => s.replace(/\s*\n\s*/g, " ");

/** the chip, the heading and the text of a section, at the left or in the centre */
export function VHead({ chip, heading, intro, center = false }: { chip?: string; heading?: string; intro?: string; center?: boolean }) {
  return (
    <header className="vk-head" data-center={center}>
      {chip && <span className="md-chip">{chip}</span>}
      {heading && <SplitHeading text={heading} className="md-h2" />}
      {intro && <p className="md-intro">{intro}</p>}
    </header>
  );
}

/**
 * One item is open at a time and it moves on by itself while the section is on the screen; as soon as the visitor picks one it stops.
 * (Nothing moves for visitors who prefer less motion.)
 */
export function useCycle(n: number, ms = 5200) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const run = auto && seen && n > 1;
  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % n), ms);
    return () => window.clearTimeout(t);
  }, [run, active, n, ms]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };
  return { active: Math.min(active, Math.max(0, n - 1)), pick, ref, run };
}
