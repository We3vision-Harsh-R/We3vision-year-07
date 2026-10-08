"use client";

import { useEffect, useId, useRef } from "react";

// Artwork of the "inside the headset" scene, all drawn with code (no image files): a random space for the background and three small
// illustrated scenes for the windows (a virtual classroom, a virtual showroom, a virtual event). The colours are the theme colours: the
// parent sets --sa1..--sa4 (see .vs-win in globals.css). A window can show a real picture instead (the image field in the admin panel).

// a small deterministic random generator (the same pictures on every visit)
const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const readHue = () => {
  const cs = getComputedStyle(document.documentElement);
  const th = parseFloat(cs.getPropertyValue("--th"));
  const ts = parseFloat(cs.getPropertyValue("--ts"));
  return { h: Number.isFinite(th) ? th : 284, s: Number.isFinite(ts) ? ts : 1 };
};

/** a random space: dark sky, soft nebula clouds, many stars, a far planet with a lit rim */
export function SpaceBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const g = c?.getContext("2d");
    if (!c || !g) return;
    const W = 1600;
    const H = 900;
    c.width = W;
    c.height = H;
    const t = readHue();
    const base = t.h + 354;
    const col = (dh: number, s: number, l: number, a = 1) => `hsl(${(base + dh + 360) % 360} ${s * t.s}% ${l}% / ${a})`;
    const r = rng(2026);
    const sky = g.createLinearGradient(0, 0, W, H);
    sky.addColorStop(0, col(-20, 70, 4));
    sky.addColorStop(0.5, col(0, 60, 8));
    sky.addColorStop(1, col(25, 70, 5));
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H);
    // nebula clouds: many soft blobs
    g.globalCompositeOperation = "screen";
    for (let k = 0; k < 7; k++) {
      const cx = r() * W;
      const cy = r() * H;
      const size = 260 + r() * 360;
      const hue = [-40, 0, 30, 60, -70][k % 5];
      for (let i = 0; i < 26; i++) {
        const x = cx + (r() - 0.5) * size * 1.2;
        const y = cy + (r() - 0.5) * size * 0.8;
        const rad = 70 + r() * size * 0.5;
        const gr = g.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, col(hue + r() * 30, 85, 32 + r() * 14, 0.06 + r() * 0.06));
        gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr;
        g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
    }
    // stars
    for (let i = 0; i < 1100; i++) {
      const x = r() * W;
      const y = r() * H;
      const m = r();
      g.fillStyle = `rgba(255,255,255,${0.15 + m * 0.7})`;
      g.beginPath();
      g.arc(x, y, 0.4 + m * m * 1.3, 0, 7);
      g.fill();
    }
    for (let i = 0; i < 26; i++) {
      const x = r() * W;
      const y = r() * H;
      const rad = 5 + r() * 9;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, "rgba(255,255,255,0.95)");
      gr.addColorStop(0.2, col(20, 90, 85, 0.4));
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // a planet far away, lit from the upper left
    g.globalCompositeOperation = "source-over";
    const px = W * 0.82;
    const py = H * 0.72;
    const pr = 170;
    const pl = g.createRadialGradient(px - pr * 0.4, py - pr * 0.4, pr * 0.1, px, py, pr);
    pl.addColorStop(0, col(30, 70, 46));
    pl.addColorStop(0.55, col(0, 70, 22));
    pl.addColorStop(1, col(-20, 80, 5));
    g.fillStyle = pl;
    g.beginPath();
    g.arc(px, py, pr, 0, 7);
    g.fill();
    const rim = g.createRadialGradient(px, py, pr * 0.9, px, py, pr * 1.18);
    rim.addColorStop(0, col(20, 100, 70, 0.35));
    rim.addColorStop(1, "rgba(0,0,0,0)");
    g.globalCompositeOperation = "screen";
    g.fillStyle = rim;
    g.beginPath();
    g.arc(px, py, pr * 1.18, 0, 7);
    g.fill();
  }, []);
  return <canvas ref={ref} className={className} aria-hidden />;
}

// ----------------------------------------------------------------------------------------------------------- small helpers
type BoxProps = { cx: number; cy: number; w: number; h: number; top: string; left: string; right: string };
/** an isometric box: (cx, cy) is the bottom corner at the front */
const Box = ({ cx, cy, w, h, top, left, right }: BoxProps) => (
  <g>
    <polygon points={`${cx - w},${cy - h + w / 2} ${cx},${cy - h + w} ${cx},${cy + w} ${cx - w},${cy + w / 2}`} style={{ fill: left }} />
    <polygon points={`${cx + w},${cy - h + w / 2} ${cx},${cy - h + w} ${cx},${cy + w} ${cx + w},${cy + w / 2}`} style={{ fill: right }} />
    <polygon points={`${cx},${cy - h} ${cx + w},${cy - h + w / 2} ${cx},${cy - h + w} ${cx - w},${cy - h + w / 2}`} style={{ fill: top }} />
  </g>
);

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: "var(--sa-d1)" }} />
        <stop offset="1" style={{ stopColor: "var(--sa-d2)" }} />
      </linearGradient>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0" style={{ stopColor: "var(--sa1)", stopOpacity: 0.95 }} />
        <stop offset="1" style={{ stopColor: "var(--sa1)", stopOpacity: 0 }} />
      </radialGradient>
      <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: "var(--sa1)", stopOpacity: 0.55 }} />
        <stop offset="1" style={{ stopColor: "var(--sa1)", stopOpacity: 0 }} />
      </linearGradient>
    </defs>
  );
}

// ----------------------------------------------------------------------------------------------------------- the three scenes
export function ArtEducation() {
  const id = useId();
  const r = rng(5);
  return (
    <svg viewBox="0 0 640 330" preserveAspectRatio="xMidYMid slice" className="vs-art" aria-hidden>
      <Defs id={id} />
      <rect width="640" height="330" fill={`url(#${id}-bg)`} />
      <circle cx="320" cy="170" r="150" fill={`url(#${id}-glow)`} opacity="0.35" />
      {/* the floor grid */}
      <g style={{ stroke: "var(--sa1)" }} strokeOpacity="0.28" strokeWidth="1.2" fill="none">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={320 + (i - 6) * 20} y1="236" x2={320 + (i - 6) * 120} y2="330" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1="0" y1={236 + Math.pow(i / 5, 1.8) * 94} x2="640" y2={236 + Math.pow(i / 5, 1.8) * 94} />
        ))}
      </g>
      {/* the board */}
      <rect x="170" y="26" width="300" height="104" rx="14" style={{ fill: "var(--sa-glass)", stroke: "var(--sa1)" }} strokeOpacity="0.7" strokeWidth="1.5" />
      <g style={{ fill: "var(--sa1)" }}>
        <rect x="190" y="46" width="120" height="8" rx="4" opacity="0.9" />
        <rect x="190" y="64" width="90" height="6" rx="3" opacity="0.5" />
        <rect x="190" y="78" width="104" height="6" rx="3" opacity="0.5" />
        <rect x="190" y="92" width="70" height="6" rx="3" opacity="0.5" />
      </g>
      <g style={{ fill: "var(--sa2)" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={340 + i * 22} y={112 - (18 + i * 11)} width="14" height={18 + i * 11} rx="3" opacity={0.7 + i * 0.05} />
        ))}
      </g>
      {/* the atom */}
      <g transform="translate(320 178)" fill="none" style={{ stroke: "var(--sa3)" }} strokeWidth="2.4">
        <ellipse rx="86" ry="30" />
        <ellipse rx="86" ry="30" transform="rotate(60)" />
        <ellipse rx="86" ry="30" transform="rotate(120)" />
        <circle r="16" fill={`url(#${id}-glow)`} stroke="none" />
        <circle r="7" style={{ fill: "#fff" }} stroke="none" />
        <circle cx="86" r="6" style={{ fill: "var(--sa2)" }} stroke="none" />
        <circle cx="-43" cy="26" r="6" style={{ fill: "var(--sa1)" }} stroke="none" />
        <circle cx="-43" cy="-26" r="6" style={{ fill: "var(--sa3)" }} stroke="none" />
      </g>
      {/* desks */}
      {[
        [96, 262],
        [168, 290],
        [544, 262],
        [472, 290],
      ].map(([x, y], i) => (
        <Box key={i} cx={x} cy={y} w={34} h={14} top="var(--sa-t)" left="var(--sa-l)" right="var(--sa-r)" />
      ))}
      {[
        [96, 236],
        [544, 236],
      ].map(([x, y], i) => (
        <polygon key={i} points={`${x - 16},${y - 26} ${x + 16},${y - 18} ${x + 16},${y} ${x - 16},${y - 8}`} style={{ fill: "var(--sa2)" }} opacity="0.85" />
      ))}
      {Array.from({ length: 34 }, (_, i) => (
        <circle key={i} cx={r() * 640} cy={r() * 330} r={0.8 + r() * 2.2} style={{ fill: "#fff" }} opacity={0.2 + r() * 0.6} />
      ))}
    </svg>
  );
}

export function ArtRetail() {
  const id = useId();
  const r = rng(9);
  return (
    <svg viewBox="0 0 640 330" preserveAspectRatio="xMidYMid slice" className="vs-art" aria-hidden>
      <Defs id={id} />
      <rect width="640" height="330" fill={`url(#${id}-bg)`} />
      <circle cx="470" cy="90" r="120" fill={`url(#${id}-glow)`} opacity="0.45" />
      <circle cx="470" cy="90" r="34" style={{ fill: "var(--sa2)" }} opacity="0.9" />
      {/* the ground ring of light */}
      <ellipse cx="320" cy="262" rx="230" ry="46" fill="none" style={{ stroke: "var(--sa1)" }} strokeOpacity="0.5" strokeWidth="2" />
      <ellipse cx="320" cy="262" rx="170" ry="34" fill="none" style={{ stroke: "var(--sa1)" }} strokeOpacity="0.3" strokeWidth="1.5" />
      {/* buildings */}
      <Box cx={196} cy={252} w={44} h={86} top="var(--sa-t)" left="var(--sa-l)" right="var(--sa-r)" />
      <Box cx={448} cy={256} w={48} h={118} top="var(--sa-t)" left="var(--sa-l)" right="var(--sa-r)" />
      <Box cx={320} cy={282} w={64} h={104} top="var(--sa-t2)" left="var(--sa-l2)" right="var(--sa-r2)" />
      {/* lit windows */}
      <g style={{ fill: "var(--sa2)" }} opacity="0.9">
        {[0, 1, 2, 3].map((i) => (
          <polygon key={`a${i}`} points={`${170},${186 + i * 17} ${186},${194 + i * 17} ${186},${202 + i * 17} ${170},${194 + i * 17}`} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon key={`b${i}`} points={`${474},${178 + i * 18} ${490},${170 + i * 18} ${490},${178 + i * 18} ${474},${186 + i * 18}`} />
        ))}
      </g>
      <polygon points="300,254 318,262 318,292 300,284" style={{ fill: "var(--sa1)" }} opacity="0.9" />
      {/* a shopping bag and a price tag floating above the showroom */}
      <g transform="translate(262 78)">
        <path d="M0 22h50l-4 54h-42z" style={{ fill: "var(--sa1)" }} />
        <path d="M14 22c0-18 22-18 22 0" fill="none" style={{ stroke: "#fff" }} strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(350 96) rotate(12)">
        <path d="M0 0h44l16 16-16 16h-44z" style={{ fill: "var(--sa3)" }} />
        <circle cx="12" cy="16" r="4" style={{ fill: "#fff" }} />
        <rect x="24" y="12" width="22" height="7" rx="3" style={{ fill: "#fff" }} opacity="0.85" />
      </g>
      {/* trees */}
      {[
        [90, 262],
        [556, 268],
        [120, 296],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 3} y={y - 10} width="6" height="14" style={{ fill: "var(--sa-l)" }} />
          <circle cx={x} cy={y - 22} r="18" style={{ fill: "var(--sa3)" }} opacity="0.55" />
        </g>
      ))}
      {Array.from({ length: 28 }, (_, i) => (
        <circle key={i} cx={r() * 640} cy={r() * 210} r={0.8 + r() * 2} style={{ fill: "#fff" }} opacity={0.2 + r() * 0.6} />
      ))}
    </svg>
  );
}

export function ArtEvent() {
  const id = useId();
  const r = rng(13);
  const confetti = Array.from({ length: 40 }, (_, i) => ({ x: r() * 640, y: r() * 200, rot: r() * 360, c: ["var(--sa1)", "var(--sa2)", "var(--sa3)", "#fff"][i % 4] }));
  return (
    <svg viewBox="0 0 640 330" preserveAspectRatio="xMidYMid slice" className="vs-art" aria-hidden>
      <Defs id={id} />
      <rect width="640" height="330" fill={`url(#${id}-bg)`} />
      {/* beams of light */}
      {[
        [90, 150],
        [210, 250],
        [430, 390],
        [550, 490],
      ].map(([a, b], i) => (
        <polygon key={i} points={`${a},0 ${a + 22},0 ${b + 80},248 ${b - 60},248`} fill={`url(#${id}-beam)`} opacity={0.55 - i * 0.04} />
      ))}
      {/* the big floating screen */}
      <rect x="200" y="40" width="240" height="132" rx="14" style={{ fill: "var(--sa-glass)", stroke: "var(--sa1)" }} strokeOpacity="0.8" strokeWidth="1.5" />
      <circle cx="320" cy="106" r="30" style={{ fill: "var(--sa1)" }} opacity="0.9" />
      <polygon points="311,90 311,122 337,106" style={{ fill: "#fff" }} />
      {/* the stage */}
      <ellipse cx="320" cy="238" rx="240" ry="38" style={{ fill: "var(--sa-t)" }} />
      <ellipse cx="320" cy="232" rx="236" ry="34" fill="none" style={{ stroke: "var(--sa1)" }} strokeOpacity="0.7" strokeWidth="2" />
      <ellipse cx="320" cy="232" rx="150" ry="21" fill={`url(#${id}-glow)`} opacity="0.6" />
      {/* the crowd, as dark shapes */}
      {Array.from({ length: 22 }, (_, i) => {
        const x = 24 + i * 28 + (i % 2) * 10;
        const y = 296 + (i % 3) * 8;
        return (
          <g key={i} style={{ fill: "var(--sa-crowd)" }}>
            <circle cx={x} cy={y - 24} r="11" />
            <path d={`M${x - 16} ${y + 40}q0-52 16-52t16 52z`} />
          </g>
        );
      })}
      {confetti.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width="7" height="3.5" transform={`rotate(${c.rot} ${c.x} ${c.y})`} style={{ fill: c.c }} opacity="0.85" />
      ))}
    </svg>
  );
}

export const ARTS = [ArtEducation, ArtRetail, ArtEvent];
