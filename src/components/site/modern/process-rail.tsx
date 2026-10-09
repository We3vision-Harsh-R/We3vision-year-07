"use client";

import { useEffect, useRef, useState } from "react";
import { GlowEdge } from "../glow-edge";
import { SplitHeading } from "./split-heading";

type Step = { title: string; text: string; points?: string };

const lines = (s?: string) => (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
const two = (n: number) => String(n).padStart(2, "0");

// The redesigned "How we work" of the service pages. On the left a column stays in place and counts the steps (a big number, the name of
// the step, a line that fills); on the right the steps pass by as cards on a line that is drawn while you scroll. The step in the middle of
// the screen is the active one. Only an IntersectionObserver and one custom property change while scrolling, so it stays light.
export function ProcessRail({ chip, heading, intro, items }: { chip: string; heading: string; intro?: string; items: Step[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || n < 1) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    // the line that is drawn while you scroll
    let raf = 0;
    const draw = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / Math.max(1, r.height)));
      list.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  if (n === 0) return null;
  return (
    <div className="md md-pr">
      <aside className="md-pr-side">
        <span className="md-chip">{chip}</span>
        <SplitHeading text={heading} className="md-h2" />
        {intro && <p className="md-intro">{intro}</p>}
        <div className="md-pr-count" aria-hidden>
          <b key={active}>{two(active + 1)}</b>
          <span>/ {two(n)}</span>
        </div>
        <p className="md-pr-now" key={`t${active}`}>
          {items[active].title}
        </p>
        <span className="md-pr-bar" aria-hidden>
          <i style={{ transform: `scaleX(${n > 1 ? (active + 1) / n : 1})` }} />
        </span>
      </aside>

      <ol ref={listRef} className="md-pr-list">
        {items.map((s, i) => (
          <li
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            data-i={i}
            data-on={i === active}
            data-done={i < active}
            className="md-pr-item bglow"
          >
            <GlowEdge />
            <span className="md-pr-dot" aria-hidden />
            <span className="md-pr-no">{two(i + 1)}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            {lines(s.points).length > 0 && (
              <ul>
                {lines(s.points).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
