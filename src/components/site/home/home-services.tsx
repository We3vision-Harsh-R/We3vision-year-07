"use client";

import { useEffect, useRef, useState } from "react";
import { SmartLink } from "@/components/site/smart-link";
import { Art, SERVICES } from "./home-svc-data";

// The services of the home page: seven cards that each carry their own details (the number of real projects, one line, tags, an animated picture of the
// service). Hovering one brings it forward and blurs the others. Branding is the hero (the widest and the most glowing). Proportions follow the
// golden ratio: the top row is 1 : 1.618 : 1 wide and 1.618 times as tall as the bottom row (see hb2-sv in styles/home.css).
// The pictures only move with transform and opacity, and only while the section is on screen (data-live).
type Stats = Record<string, { n: number; latest: string }>;

export function HomeServices({ stats }: { stats: Stats }) {
  const [on, setOn] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cell = (i: number) => {
    const s = SERVICES[i];
    const st = stats[s.key];
    const big = i < 3;
    return (
      <div className="hb2-sv-cell" key={s.key} data-on={on === i ? "" : undefined}>
        <SmartLink
          href={s.href}
          className={`hb2-sv-card hb2-sv-${s.key}`}
          onMouseEnter={() => setOn(i)}
          onFocus={() => setOn(i)}
          onBlur={() => setOn(null)}>
          <span className="hb2-sv-kick">{st && st.n > 0 ? `${st.n} ${st.n === 1 ? "project" : "projects"} built` : s.kick}</span>
          <h3>
            <em>{s.em}</em> {s.rest}
          </h3>
          <p className="hb2-sv-line">{s.line}</p>
          <div className="hb2-sv-art" aria-hidden>
            <Art k={s.key} />
          </div>
          {big && (
            <div className="hb2-sv-foot">
              <span className="hb2-sv-tags">
                {s.tags.map((t) => (
                  <b key={t}>{t}</b>
                ))}
              </span>
              {st?.latest && <span className="hb2-sv-last">Latest: {st.latest}</span>}
            </div>
          )}
          <svg viewBox="0 0 24 24" aria-hidden className="hb2-sv-ar">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </SmartLink>
      </div>
    );
  };
  return (
    <section className="hb2-sv" id="services" aria-labelledby="hb2-t3" ref={ref} data-live={live ? "" : undefined}>
      <div className="hb2-wrap">
        <p className="hb2-label">Services</p>
        <h2 id="hb2-t3" className="hb2-sv-h" data-r>
          <em>What we build</em> for your business
        </h2>
        <div className="hb2-sv-grid" data-active={on === null ? undefined : ""} onMouseLeave={() => setOn(null)}>
          <div className="hb2-sv-r1">{[0, 1, 2].map(cell)}</div>
          <div className="hb2-sv-r2">{[3, 4, 5, 6].map(cell)}</div>
        </div>
      </div>
    </section>
  );
}
