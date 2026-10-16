"use client";

import { useEffect, useRef, useState } from "react";
import { GlowEdge } from "../glow-edge";
import { PandaMini } from "./panda-mini";

// "At a glance" as a small dashboard of glass tiles instead of four plain columns: every fact has a little picture that draws itself when
// the tile comes into view and a number that counts up: the year (a growing line), the years of work (a ring of seven marks), the team
// (a crowd of dots, the size of the team lit up) and the offices (two pins on a dotted map, joined by an arc). Pando peeks over the first tile.

export type GlanceItem = { value: string; label: string };

/** "2019" -> counts to 2019; "11–50" -> counts both numbers; anything else is shown as it is */
function useCount(value: string, on: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = reduced ? 1 : Math.min(1, (now - t0) / 1400);
      setT(1 - Math.pow(1 - k, 3));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, value]);
  const parts = value.split(/(\d+)/);
  return parts.map((p) => (/^\d+$/.test(p) ? String(Math.round(Number(p) * t)) : p)).join("");
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

// ------------------------------------------------------------------------------------------------- the little pictures
function GrowLine({ on }: { on: boolean }) {
  const pts: [number, number][] = [
    [8, 86],
    [48, 80],
    [88, 70],
    [128, 62],
    [168, 46],
    [208, 36],
    [248, 22],
    [288, 10],
  ];
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  return (
    <svg viewBox="0 0 300 100" className="gl-viz" data-on={on} aria-hidden>
      <defs>
        <linearGradient id="gl-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L288 100 L8 100 Z`} fill="url(#gl-area)" className="gl-area" />
      <path d={d} className="gl-draw" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === 0 || i === pts.length - 1 ? 5 : 3} className="gl-dot" style={{ "--i": i } as React.CSSProperties} />
      ))}
      <text x="8" y="99" className="gl-t">2019</text>
      <text x="262" y="99" className="gl-t">now</text>
    </svg>
  );
}

function Ring({ on }: { on: boolean }) {
  const n = 7;
  return (
    <svg viewBox="0 0 120 120" className="gl-viz gl-ring" data-on={on} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 60 + Math.cos(a) * 44;
        const y = 60 + Math.sin(a) * 44;
        return <rect key={i} x={x - 4.5} y={y - 15} width="9" height="30" rx="4.5" transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} className="gl-seg" style={{ "--i": i } as React.CSSProperties} />;
      })}
      <circle cx="60" cy="60" r="22" className="gl-core" />
    </svg>
  );
}

function Crowd({ on }: { on: boolean }) {
  return (
    <div className="gl-crowd" data-on={on} aria-hidden>
      {Array.from({ length: 50 }, (_, i) => (
        <i key={i} data-core={i < 11} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Pins({ on }: { on: boolean }) {
  // a dotted strip of the world, India and Germany marked, joined by an arc
  const dots: [number, number][] = [];
  for (let y = 0; y < 9; y++) for (let x = 0; x < 30; x++) if (Math.sin(x * 0.55 + y * 0.9) + Math.cos(x * 0.21 - y * 0.6) > 0.3) dots.push([10 + x * 9, 8 + y * 9]);
  return (
    <svg viewBox="0 0 290 100" className="gl-viz gl-map" data-on={on} aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={d[0]} cy={d[1]} r="1.8" className="gl-md" />
      ))}
      <path d="M96 30 Q150 -6 214 52" fill="none" className="gl-arc gl-draw" pathLength="1" strokeWidth="2" strokeDasharray="0.03 0.03" />
      {[
        [96, 30],
        [214, 52],
      ].map(([x, y], i) => (
        <g key={i} className="gl-pin" style={{ "--i": i } as React.CSSProperties}>
          <circle cx={x} cy={y} r="9" className="gl-halo" />
          <circle cx={x} cy={y} r="4.5" className="gl-pt" />
        </g>
      ))}
      <text x="80" y="20" className="gl-t">Germany</text>
      <text x="196" y="72" className="gl-t">India</text>
    </svg>
  );
}

function Tile({ item, index }: { item: GlanceItem; index: number }) {
  const [ref, on] = useInView();
  const value = useCount(item.value, on);
  const viz = [<GrowLine key="a" on={on} />, <Ring key="b" on={on} />, <Crowd key="c" on={on} />, <Pins key="d" on={on} />][index % 4];
  return (
    <div ref={ref} className={`gl-tile bglow card-glass gl-t${index % 4}`} data-on={on}>
      <GlowEdge />
      {index === 0 && <PandaMini className="gl-panda" />}
      <div className="gl-text">
        <span className="gl-no">{String(index + 1).padStart(2, "0")}</span>
        <b className="gl-value">{value}</b>
        <span className="gl-label">{item.label}</span>
      </div>
      <div className="gl-pic">{viz}</div>
    </div>
  );
}

export function Glance({ chip, items }: { chip: string; items: GlanceItem[] }) {
  return (
    <div className="gl">
      <h2 className="gl-title text-vfade">{chip}</h2>
      <div className="gl-grid" data-n={items.length}>
        {items.map((it, i) => (
          <Tile key={i} item={it} index={i} />
        ))}
      </div>
    </div>
  );
}
