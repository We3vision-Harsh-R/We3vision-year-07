"use client";

import { useEffect, useRef } from "react";
import { GlanceMin } from "./glance-min";
import { GlowEdge } from "./glow-edge";
import { SplitHeading } from "./modern/split-heading";

// "At a glance" of the home page as a small control room: in the middle a ring that counts the years of We3vision (one light for every year, from
// the year we started, a little comet goes round), and around it the other facts as glass cards that fly in from the ring one after the other, each
// with a thin line back to it and a light that follows the mouse. The first fact is the year we started, the second the number of years; the rest
// are the cards (as many as there are). If those two are not numbers, the plain row (glance-min.tsx) is used. Plain text in the page; with less
// motion (or without JavaScript) the final figures are simply there. The look is in globals.css (.go-*).

type Item = { value: string; label: string };

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** the text with every number in it replaced by the number at progress t (0..1) */
function at(text: string, t: number) {
  return text.replace(/\d+/g, (m) => {
    const n = Number(m);
    const from = n >= 1000 ? n - 25 : 0;
    return String(Math.round(from + (n - from) * ease(t)));
  });
}

const ICONS: [RegExp, string][] = [
  [/project/i, "M12 3l2.4 1.7 2.9.2 1 2.7 2.2 1.9-.9 2.8.9 2.8-2.2 1.9-1 2.7-2.9.2L12 21l-2.4-1.7-2.9-.2-1-2.7-2.2-1.9.9-2.8-.9-2.8 2.2-1.9 1-2.7 2.9-.2zM9 12l2 2 4-4"],
  [/industr/i, "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01"],
  [/platform|technolog|stack/i, "M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12"],
  [/team|people|member/i, "M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1a3 3 0 0 0-2.5-3M15.5 5.2a3 3 0 0 1 0 5.6"],
  [/office|location|city/i, "M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"],
  [/service|solution/i, "M12 3l9 5-9 5-9-5zM3 12.5l9 5 9-5"],
];
const STAR = "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z";
const iconFor = (label: string) => ICONS.find(([re]) => re.test(label))?.[1] ?? STAR;

export function GlanceOrbit({ chip, items }: { chip: string; items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const year = Number(items[0]?.value);
  const years = Number(items[1]?.value);
  const ok = Number.isInteger(year) && year > 1900 && Number.isInteger(years) && years >= 2 && years <= 12;

  useEffect(() => {
    const el = ref.current;
    if (!el || !ok || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nums = Array.from(el.querySelectorAll<HTMLElement>(".go-num"));
    const finals = nums.map((n) => n.dataset.final ?? n.textContent ?? ""); // (read from the markup: the effect can run twice in development)
    el.dataset.go = "wait";
    nums.forEach((n, i) => (n.textContent = at(finals[i], 0)));
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.go = "in";
        const t0 = performance.now();
        // the years count first, the cards count when they have landed (one after the other): data-delay says when
        const step = (now: number) => {
          let more = false;
          nums.forEach((n, i) => {
            const t = Math.min(1, Math.max(0, (now - t0 - Number(n.dataset.delay ?? 0)) / 1500));
            n.textContent = t >= 1 ? finals[i] : at(finals[i], t);
            if (t < 1) more = true;
          });
          if (more) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ok]);

  if (!ok) return <GlanceMin chip={chip} items={items} />;

  const cards = items.slice(2, 6);
  const left = cards.filter((_, i) => i % 2 === 0);
  const right = cards.filter((_, i) => i % 2 === 1);
  const card = (it: Item, k: number, side: "l" | "r") => (
    <li key={`${side}${k}`} className="go-card bglow" data-side={side} style={{ "--k": k * 2 + (side === "l" ? 0 : 1) } as React.CSSProperties}>
      <GlowEdge />
      <svg viewBox="0 0 24 24" aria-hidden className="go-ic">
        <path d={iconFor(it.label)} />
      </svg>
      <b className="go-num" data-final={it.value} data-delay={1250 + (k * 2 + (side === "l" ? 0 : 1)) * 180}>
        {it.value}
      </b>
      <span className="go-label">{it.label}</span>
      <i className="go-line" aria-hidden />
    </li>
  );

  return (
    <div ref={ref} className="go">
      <SplitHeading text={chip} className="sh-center mx-auto text-[2.4rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-5xl md:text-[60px]" />
      <div className="go-stage" style={{ "--n": years } as React.CSSProperties}>
        <ul className="go-side" data-side="l">
          {left.map((it, k) => card(it, k, "l"))}
        </ul>

        <div className="go-ring">
          <svg viewBox="0 0 400 400" aria-hidden>
            <circle className="go-track" cx="200" cy="200" r="150" />
            <circle className="go-dash" cx="200" cy="200" r="122" />
            <circle className="go-arc" cx="200" cy="200" r="150" pathLength="100" />
          </svg>
          <span className="go-comet" aria-hidden />
          {Array.from({ length: years }, (_, i) => {
            const a = (-90 + (i * 360) / years) * (Math.PI / 180);
            return (
              <span key={i} className="go-tick" style={{ "--i": i, "--x": `${(50 + 37.5 * Math.cos(a)).toFixed(2)}%`, "--y": `${(50 + 37.5 * Math.sin(a)).toFixed(2)}%`, "--lx": `${(50 + 49 * Math.cos(a)).toFixed(2)}%`, "--ly": `${(50 + 49 * Math.sin(a)).toFixed(2)}%` } as React.CSSProperties}>
                <i />
                <em>{year + i}</em>
              </span>
            );
          })}
          <div className="go-core">
            <b className="go-num" data-final={items[1].value} data-delay={300}>
              {items[1].value}
            </b>
            <span>{items[1].label}</span>
            <small>{items[0].label}</small>
          </div>
        </div>

        <ul className="go-side" data-side="r">
          {right.map((it, k) => card(it, k, "r"))}
        </ul>
      </div>
    </div>
  );
}
