"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IndustryIcon } from "../icons";
import { kindOf } from "../city-scene";
import { PersonTop } from "../timeline-art";

// "Industries we serve" on the service pages ("modern" skin): a little map seen from above where somebody walks, cycles or drives along a
// road from industry to industry while the page scrolls. Every service page has its own road (a serpentine, a ring, a spiral, city streets,
// a figure of eight, a wave, a switchback, a climb, a circuit), its own traveller and its own scenery, so no two pages look the same
// (see VARIANTS). Every industry is a building of its own kind beside the road (a school, a bank, a factory ...); the traveller stops at
// each one and the text of that industry is shown in the panel. Pinned on a desktop; a plain list on a tablet and a phone (and for visitors
// who prefer less motion). It is all SVG and a handful of elements: nothing heavy, and it stops while it is off the screen.

type Item = { name: string; description: string };
import type { Shape, Traveller, Variant } from "./map-variants";
import { DEFAULT_VARIANT } from "./map-variants";

const VW = 1000;
const VH = 560;

const sample = (f: (t: number) => [number, number], n: number) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const [x, y] = f(i / n);
    return `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

/** the road of every shape, in a 1000 x 560 box */
const ROADS: Record<Shape, string> = {
  serpentine: "M 40 100 H 740 C 900 100 900 290 740 290 H 260 C 100 290 100 480 260 480 H 960",
  ring: "M 70 280 A 430 215 0 1 1 930 280 A 430 215 0 1 1 70 280",
  spiral: sample((t) => {
    const a = t * Math.PI * 4.4 + 0.4;
    const r = 262 * (1 - t * 0.68);
    return [500 + r * 1.62 * Math.cos(a), 285 + r * 0.98 * Math.sin(a)];
  }, 200),
  grid: "M 40 480 H 220 Q 260 480 260 440 V 160 Q 260 120 300 120 H 520 Q 560 120 560 160 V 390 Q 560 430 600 430 H 800 Q 840 430 840 390 V 110 Q 840 70 880 70 H 960",
  figure8: sample((t) => {
    const a = t * Math.PI * 2 + Math.PI / 2;
    const d = 1 + Math.sin(a) * Math.sin(a);
    return [500 + (430 * Math.cos(a)) / d, 285 + (230 * Math.sin(a) * Math.cos(a)) / d];
  }, 240),
  wave: sample((t) => [40 + t * 920, 280 + Math.sin(t * Math.PI * 3.5) * 170], 160),
  switchback: "M 60 500 H 800 Q 900 500 900 430 Q 900 360 800 360 H 200 Q 100 360 100 290 Q 100 220 200 220 H 800 Q 900 220 900 150 Q 900 80 800 80 H 460",
  climb: "M 40 510 C 210 510 230 380 400 380 S 590 250 730 250 S 850 120 960 70",
  circuit: "M 40 320 H 200 L 270 250 V 120 L 330 60 H 560 L 630 130 V 270 L 700 340 H 790 L 850 400 V 490 L 890 530 H 960",
};

// ---- buildings: a front view with a little depth, one for every kind of industry (all in a 120 x 110 box, the base line at y = 100) ----
function Block({ x, y, w, h, d = 16 }: { x: number; y: number; w: number; h: number; d?: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} className="im-front" />
      <polygon points={`${x + w},${y} ${x + w + d},${y - d * 0.6} ${x + w + d},${y + h - d * 0.6} ${x + w},${y + h}`} className="im-side" />
      <polygon points={`${x},${y} ${x + d},${y - d * 0.6} ${x + w + d},${y - d * 0.6} ${x + w},${y}`} className="im-top" />
    </>
  );
}
const Windows = ({ x, y, cols, rows, gx = 16, gy = 16, s = 8 }: { x: number; y: number; cols: number; rows: number; gx?: number; gy?: number; s?: number }) => (
  <>
    {Array.from({ length: cols * rows }, (_, i) => (
      <rect key={i} x={x + (i % cols) * gx} y={y + Math.floor(i / cols) * gy} width={s} height={s} rx="1.5" className="im-win" style={{ animationDelay: `${(i * 0.37) % 3}s` }} />
    ))}
  </>
);
function Building({ kind }: { kind: ReturnType<typeof kindOf> }) {
  switch (kind) {
    case "education":
      return (
        <>
          <Block x={14} y={52} w={78} h={48} />
          <polygon points="8,52 53,22 98,52" className="im-roof" />
          <rect x="46" y="70" width="14" height="30" rx="2" className="im-door" />
          <Windows x={22} y={62} cols={2} rows={1} gx={50} s={12} />
          <path d="M53 22V6M53 6l14 5-14 5" className="im-flag" />
        </>
      );
    case "health":
      return (
        <>
          <Block x={14} y={34} w={80} h={66} />
          <rect x="44" y="44" width="20" height="6" rx="1" className="im-mark" />
          <rect x="51" y="37" width="6" height="20" rx="1" className="im-mark" />
          <Windows x={24} y={66} cols={4} rows={1} gx={20} s={10} />
          <rect x="46" y="84" width="16" height="16" rx="2" className="im-door" />
        </>
      );
    case "finance":
      return (
        <>
          <polygon points="6,42 56,16 106,42" className="im-roof" />
          <Block x={14} y={42} w={84} h={10} d={10} />
          {[22, 40, 58, 76].map((cx) => (
            <rect key={cx} x={cx} y={52} width="9" height="40" rx="2" className="im-front" />
          ))}
          <Block x={8} y={92} w={96} h={8} d={10} />
        </>
      );
    case "estate":
      return (
        <>
          <Block x={10} y={44} w={46} h={56} />
          <Windows x={18} y={54} cols={2} rows={3} gx={18} gy={16} />
          <Block x={64} y={64} w={38} h={36} />
          <polygon points="60,64 83,46 106,64" className="im-roof" />
          <rect x="76" y="80" width="12" height="20" rx="2" className="im-door" />
        </>
      );
    case "shop":
      return (
        <>
          <Block x={12} y={48} w={84} h={52} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={12 + i * 14} y={40} width="14" height="14" className={i % 2 ? "im-awn-a" : "im-awn-b"} />
          ))}
          <rect x="22" y="68" width="30" height="32" rx="2" className="im-win" />
          <rect x="62" y="72" width="14" height="28" rx="2" className="im-door" />
        </>
      );
    case "fun":
      return (
        <>
          <Block x={14} y={58} w={80} h={42} />
          <path d="M14 58a40 40 0 0 1 80 0z" className="im-roof" />
          <path d="M54 18V6M40 24l-10-8M68 24l10-8" className="im-flag" />
          <rect x="44" y="76" width="20" height="24" rx="10" className="im-door" />
        </>
      );
    case "factory":
      return (
        <>
          <Block x={10} y={56} w={90} h={44} />
          <polygon points="10,56 28,38 28,56 46,38 46,56 64,38 64,56 82,38 82,56 100,56" className="im-roof" />
          <rect x="84" y="14" width="12" height="42" className="im-front" />
          <circle cx="92" cy="8" r="6" className="im-smoke" />
          <circle cx="100" cy="-2" r="8" className="im-smoke im-smoke-b" />
          <rect x="22" y="76" width="26" height="24" rx="2" className="im-door" />
        </>
      );
    case "tech":
      return (
        <>
          <Block x={26} y={20} w={52} h={80} />
          <Windows x={34} y={30} cols={3} rows={5} gx={16} gy={14} s={9} />
          <path d="M52 20V4" className="im-flag" />
          <circle cx="52" cy="4" r="3" className="im-mark" />
          <Block x={80} y={66} w={24} h={34} d={8} />
        </>
      );
    case "creative":
      return (
        <>
          <Block x={12} y={46} w={84} h={54} />
          <rect x="22" y="56" width="40" height="28" rx="3" className="im-win" />
          <path d="M28 76l8-10 8 6 10-12" className="im-flag" />
          <circle cx="80" cy="64" r="8" className="im-mark" />
          <path d="M12 46h84" className="im-roof-line" />
        </>
      );
    case "travel":
      return (
        <>
          <Block x={22} y={22} w={64} h={78} />
          <Windows x={30} y={32} cols={4} rows={4} gx={14} gy={15} s={8} />
          <rect x="44" y="84" width="20" height="16" rx="2" className="im-door" />
          <path d="M6 30l18-6-14-10 22 2 10-14 2 12 16 2-16 8z" className="im-mark" transform="translate(66 -12) scale(0.7)" />
        </>
      );
    default:
      return (
        <>
          <Block x={18} y={34} w={68} h={66} />
          <Windows x={28} y={44} cols={3} rows={3} gx={18} gy={16} s={10} />
          <rect x="46" y="84" width="14" height="16" rx="2" className="im-door" />
        </>
      );
  }
}

// ---- the traveller (drawn facing right, turned by the way the road goes) ----
function Rider({ tone, bike }: { tone: number; bike: "bike" | "scooter" | "none" }) {
  return (
    <span className="im-rider" style={{ "--tone": tone } as React.CSSProperties}>
      {bike === "bike" && (
        <svg viewBox="0 0 80 40" className="im-bike" aria-hidden>
          <ellipse cx="14" cy="20" rx="13" ry="3.4" className="im-wheel" />
          <ellipse cx="66" cy="20" rx="13" ry="3.4" className="im-wheel" />
          <path d="M14 20L36 20L52 20M36 20V14M52 20L66 20M52 20V12" className="im-frame" />
        </svg>
      )}
      {bike === "scooter" && (
        <svg viewBox="0 0 80 40" className="im-bike" aria-hidden>
          <rect x="6" y="14" width="68" height="12" rx="6" className="im-deck" />
          <rect x="62" y="6" width="5" height="28" rx="2.5" className="im-frame-b" />
        </svg>
      )}
      <span className="tl-p im-person" data-pose="walk" data-face="down" data-wave="false" data-tag="none">
        <PersonTop />
      </span>
    </span>
  );
}
function TravellerArt({ kind, tone }: { kind: Traveller; tone: number }) {
  if (kind === "bus")
    return (
      <svg viewBox="0 0 130 50" className="im-bus" aria-hidden>
        <rect x="2" y="4" width="126" height="42" rx="9" className="im-bus-b" />
        <rect x="16" y="9" width="96" height="32" rx="6" className="im-bus-r" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={22 + i * 18} y="14" width="12" height="22" rx="2" className="im-win" />
        ))}
        <rect x="116" y="10" width="9" height="30" rx="3" className="im-win" />
        <circle cx="126" cy="14" r="2.6" className="im-light" />
        <circle cx="126" cy="36" r="2.6" className="im-light" />
      </svg>
    );
  if (kind === "rover")
    return (
      <svg viewBox="0 0 70 54" className="im-rover" aria-hidden>
        <rect x="6" y="2" width="58" height="12" rx="5" className="im-tread" />
        <rect x="6" y="40" width="58" height="12" rx="5" className="im-tread" />
        <rect x="10" y="10" width="50" height="34" rx="9" className="im-bus-b" />
        <rect x="38" y="16" width="16" height="22" rx="5" className="im-win" />
        <circle cx="46" cy="27" r="4.4" className="im-light" />
        <path d="M18 20h12M18 28h12M18 36h8" className="im-frame" />
      </svg>
    );
  return <Rider tone={tone} bike={kind === "cyclist" ? "bike" : kind === "scooter" ? "scooter" : "none"} />;
}

const two = (n: number) => String(n).padStart(2, "0");
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

export function IndustriesMap({ items, variant = DEFAULT_VARIANT }: { items: Item[]; variant?: Variant }) {
  const n = items.length;
  const uid = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const travRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [stops, setStops] = useState<{ x: number; y: number; nx: number; ny: number }[]>([]);
  const road = ROADS[variant.shape];

  // where the buildings stand: beside the road, one on this side, the next on the other
  useEffect(() => {
    const path = pathRef.current;
    if (!path || n < 1) return;
    const L = path.getTotalLength();
    const pts = items.map((_, i) => {
      const f = n === 1 ? 0.5 : 0.07 + (0.86 * i) / (n - 1);
      const p = path.getPointAtLength(f * L);
      const q = path.getPointAtLength(Math.min(L, f * L + 4));
      const a = Math.atan2(q.y - p.y, q.x - p.x);
      const side = i % 2 === 0 ? -1 : 1;
      return { x: p.x, y: p.y, nx: Math.sin(a) * side, ny: -Math.cos(a) * side };
    });
    setStops(pts);
  }, [road, n, items]);

  // the traveller follows the scroll with a soft glide
  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const map = mapRef.current;
    const path = pathRef.current;
    const trav = travRef.current;
    if (!track || !sticky || !map || !path || !trav || n < 2) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const L = path.getTotalLength();
    const stopLen = (i: number) => (0.07 + (0.86 * i) / (n - 1)) * L;
    let raf = 0;
    let target = 0;
    let cur = -1;
    let lastT = 0;
    let last = -1;
    let k = 1;
    let idleT = 0;
    let lastD = -1;
    const measure = () => {
      k = map.clientWidth / VW;
    };
    const place = (f: number) => {
      const i = Math.min(n - 2, Math.max(0, Math.floor(f)));
      const d = stopLen(i) + (stopLen(i + 1) - stopLen(i)) * (f - i);
      const p = path.getPointAtLength(d);
      const q = path.getPointAtLength(Math.min(L, d + 3));
      const a = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      trav.style.transform = `translate(${(p.x * k).toFixed(1)}px, ${(p.y * k).toFixed(1)}px)`;
      trav.style.setProperty("--rot", `${a.toFixed(1)}deg`);
      const moving = Math.abs(d - lastD) > 0.15;
      lastD = d;
      trav.dataset.moving = String(moving);
      const person = trav.querySelector<HTMLElement>(".tl-p");
      if (person) person.dataset.pose = moving ? "walk" : "idle";
      window.clearTimeout(idleT);
      idleT = window.setTimeout(() => {
        trav.dataset.moving = "false";
        if (person) person.dataset.pose = "idle";
      }, 160);
      const idx = Math.round(f);
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000 || 0.016));
      lastT = now;
      if (cur < 0) cur = target;
      cur += (target - cur) * (1 - Math.exp(-dt * 5));
      if (Math.abs(target - cur) < 0.0006) cur = target;
      place(cur);
      if (cur !== target) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const dist = Math.max(1, r.height - sticky.offsetHeight);
      const p = Math.min(1, Math.max(0, (top - r.top) / dist));
      const seg = p * (n - 1);
      const i = Math.min(n - 2, Math.floor(seg));
      // every industry holds the traveller for a while, the way to the next one takes the rest
      target = p >= 1 ? n - 1 : i + smooth((seg - i - 0.22) / 0.56);
      if (!raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const onResize = () => {
      measure();
      place(Math.max(0, cur));
      onScroll();
    };
    measure();
    place(0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(map);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      window.clearTimeout(idleT);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, road]);

  // everything that moves stops while the map is not on the screen
  useEffect(() => {
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!sticky || !track) return;
    const io = new IntersectionObserver(([e]) => sticky.setAttribute("data-live", String(e.isIntersecting)), { rootMargin: "100px" });
    io.observe(track);
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky || n < 2) return;
    const to = Math.min(n - 1, Math.max(0, i));
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const dist = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    const y = track.getBoundingClientRect().top + window.scrollY - top + (to / (n - 1)) * dist;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (n === 0) return null;
  const cur = items[Math.min(active, n - 1)];
  const trees = Array.from({ length: 14 }, (_, i) => ({ x: 60 + ((i * 197) % 880), y: 40 + ((i * 131) % 480), s: 0.5 + ((i * 7) % 5) / 10 }));

  return (
    <div ref={trackRef} className="im" data-pin={n > 1} data-scene={variant.scenery} style={{ "--n": n, "--tone": variant.tone } as React.CSSProperties}>
      {/* the real content: a list (the only thing shown on a tablet and a phone) */}
      <ol className="im-list">
        {items.map((it, i) => (
          <li key={i}>
            <span className="im-l-ico">
              <IndustryIcon name={it.name} className="size-7" />
            </span>
            <div>
              <h3>{it.name}</h3>
              <p>{it.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div ref={stickyRef} className="im-sticky" data-live="false" aria-hidden>
        <div className="im-stage">
          <div ref={mapRef} className="im-map">
            <svg viewBox={`0 0 ${VW} ${VH}`} className="im-svg" preserveAspectRatio="xMidYMid meet">
              {/* the scenery */}
              <g className="im-scenery">
                {variant.scenery === "river" && <path d="M-20 330 C 200 250 330 430 520 330 S 800 210 1020 300" className="im-water" />}
                {variant.scenery === "lake" && <ellipse cx="500" cy="285" rx="150" ry="80" className="im-water-f" />}
                {variant.scenery === "park" && <ellipse cx="500" cy="285" rx="220" ry="110" className="im-grass" />}
                {variant.scenery === "mountains" &&
                  [120, 330, 640, 880].map((x, i) => <polygon key={x} points={`${x - 110},${150 + (i % 2) * 40} ${x},${30 + (i % 2) * 30} ${x + 110},${150 + (i % 2) * 40}`} className="im-mount" />)}
                {variant.scenery === "circuit" &&
                  [150, 420, 700, 900].map((x, i) => <rect key={x} x={x} y={90 + ((i * 160) % 360)} width="64" height="48" rx="6" className="im-chip" />)}
              </g>
              {variant.scenery !== "circuit" &&
                trees.map((t, i) => (
                  <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`} className="im-tree">
                    <circle r="20" className="im-crown-d" />
                    <circle cx="-6" cy="-6" r="12" className="im-crown" />
                  </g>
                ))}
              {/* the road */}
              <path d={road} className="im-road-b" />
              <path ref={pathRef} d={road} className="im-road" />
              <path d={road} className="im-dash" />
              {/* the buildings, one for every industry */}
              {stops.map((s, i) => {
                const bx = Math.min(VW - 124, Math.max(6, s.x + s.nx * 78 - 56));
                const by = Math.min(VH - 112, Math.max(10, s.y + s.ny * 70 - 96));
                const on = i === active;
                return (
                  <g key={i} className="im-bld" data-on={on} transform={`translate(${bx.toFixed(1)} ${by.toFixed(1)})`}>
                    <ellipse cx="58" cy="102" rx="64" ry="9" className="im-shadow" />
                    <Building kind={kindOf(items[i].name)} />
                    <circle cx={s.x - bx} cy={s.y - by} r="7" className="im-stop" />
                  </g>
                );
              })}
            </svg>

            {/* the names (HTML, so that they are crisp) */}
            {stops.map((s, i) => (
              <span
                key={i}
                className="im-name"
                data-on={i === active}
                data-near={Math.abs(i - active) <= 1}
                style={{ left: `${((s.x + s.nx * 78) / VW) * 100}%`, top: `${((s.y + s.ny * 70 + (s.ny > 0 ? 18 : 20)) / VH) * 100}%` }}
              >
                {items[i].name}
              </span>
            ))}

            <div ref={travRef} className="im-trav" data-moving="false" data-kind={variant.traveller}>
              <div className="im-trav-in">
                <TravellerArt kind={variant.traveller} tone={variant.tone} />
              </div>
            </div>
          </div>

          {/* the reading panel */}
          <div id={`${uid}-panel`} className="im-panel">
            <div key={active} className="im-p-in">
              <p className="im-p-top">
                Stop {active + 1} of {n}
              </p>
              <span className="im-p-ico">
                <IndustryIcon name={cur.name} className="size-8" />
              </span>
              <h3>{cur.name}</h3>
              <p className="im-p-text">{cur.description}</p>
            </div>
            <div className="im-p-nav">
              <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous industry" tabIndex={-1}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </button>
              <div className="im-dots">
                {items.map((it, i) => (
                  <button key={i} type="button" data-on={i === active} data-done={i < active} aria-label={`${two(i + 1)} ${it.name}`} onClick={() => goTo(i)} tabIndex={-1} />
                ))}
              </div>
              <button type="button" onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label="Next industry" tabIndex={-1}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
