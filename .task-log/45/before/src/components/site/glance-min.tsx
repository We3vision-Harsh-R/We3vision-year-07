"use client";

import { useEffect, useRef } from "react";
import { SplitHeading } from "./modern/split-heading";

// "At a glance" of the home page, minimal: the heading and a row of figures, every one on a thin line that draws itself. When the row
// comes into view the line draws, the figures count up (a year only rolls the last few years) and the labels rise in, one after the other.
// Plain text in the page (nothing hidden from Google); with less motion, or without JavaScript, the final figures are simply there.
// The look is in globals.css (.gm-*). The About page keeps its own, richer version (about/glance.tsx).

type Item = { value: string; label: string };

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** the text with every number in it replaced by the number at progress t (0..1) */
function at(text: string, t: number) {
  return text.replace(/\d+/g, (m) => {
    const n = Number(m);
    const from = n >= 1000 ? n - 25 : 0; // a year rolls over the last years only
    return String(Math.round(from + (n - from) * ease(t)));
  });
}

export function GlanceMin({ chip, items }: { chip: string; items: Item[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nums = Array.from(el.querySelectorAll<HTMLElement>(".gm-num"));
    const finals = nums.map((n) => n.dataset.final ?? n.textContent ?? ""); // (read from the markup: the effect can run twice in development)
    el.dataset.gm = "wait";
    nums.forEach((n, i) => (n.textContent = at(finals[i], 0)));
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.gm = "in";
        const t0 = performance.now();
        const step = (now: number) => {
          // the figures count one after the other (every one starts a little later than the one before)
          let more = false;
          nums.forEach((n, i) => {
            const t = Math.min(1, Math.max(0, (now - t0 - 250 - i * 160) / 1500));
            n.textContent = t >= 1 ? finals[i] : at(finals[i], t);
            if (t < 1) more = true;
          });
          if (more) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="gm">
      <SplitHeading text={chip} className="sh-center mx-auto text-[2.4rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-5xl md:text-[60px]" />
      <ol ref={ref} className="gm-row" style={{ "--cols": items.length } as React.CSSProperties}>
        {items.map((it, i) => (
          <li key={i} className="gm-item" style={{ "--i": i } as React.CSSProperties}>
            <span className="gm-idx">{String(i + 1).padStart(2, "0")}</span>
            <b className="gm-num" data-final={it.value}>
              {it.value}
            </b>
            <span className="gm-label">{it.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
