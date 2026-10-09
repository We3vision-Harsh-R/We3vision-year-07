"use client";

import { GlowEdge } from "../glow-edge";
import { IconTile } from "../icons";

type Item = { title: string; description: string };

const two = (n: number) => String(n).padStart(2, "0");

// The redesigned "Why us" of the service pages: a bento of reason cards (the first one is big). A soft light follows the pointer over the
// card it is on (one custom property pair per card, nothing else changes), and the border of the card glows near the pointer.
export function WhyBento({ items }: { items: Item[] }) {
  const follow = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
    el.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
  };
  return (
    <div className="md md-why">
      {items.map((it, i) => (
        <article key={i} className="md-why-card bglow" data-big={i === 0 && items.length >= 4} onPointerMove={follow}>
          <GlowEdge />
          <span className="md-spot" aria-hidden />
          <span className="md-why-no" aria-hidden>
            {two(i + 1)}
          </span>
          <IconTile index={i + 2} large />
          <h3>{it.title}</h3>
          <p>{it.description}</p>
        </article>
      ))}
    </div>
  );
}
