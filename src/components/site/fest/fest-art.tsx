import { useId, type CSSProperties } from "react";

// The drawn pieces of the festival layers (inline SVG, no pictures): a sky lantern, an akash kandil, a diya, a marigold, a rangoli and a toran
// garland. They are plain shapes; the movement (swing, flicker, twinkle, turn) is CSS in src/styles/fest.css ("fs-").

export function SkyLantern() {
  const id = useId();
  return (
    <svg viewBox="0 0 40 54" width="40" height="54" aria-hidden>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.55" stopColor="#fb923c" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <path d="M8 4h24l5 38H3z" fill={`url(#${id}p)`} opacity="0.94" />
      <path d="M14 4l-3 38M26 4l3 38" stroke="#fff7ed" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="20" cy="44" rx="17" ry="3" fill="#7c2d12" />
      <circle cx="20" cy="42" r="3" fill="#fff7cc" />
    </svg>
  );
}

export function Kandil() {
  return (
    <svg viewBox="0 0 80 150" width="80" height="150" aria-hidden>
      <line x1="40" y1="0" x2="40" y2="40" stroke="#3b2f2a" strokeWidth="1.4" />
      <rect x="33" y="38" width="14" height="6" rx="2" fill="#92400e" />
      {/* the star-shaped body of an akash kandil */}
      <path d="M40 44L58 62L76 70L58 80L40 104L22 80L4 70L22 62Z" fill="#f97316" />
      <path d="M40 44L58 62L40 74L22 62Z" fill="#fbbf24" />
      <path d="M22 80L40 74L58 80L40 104Z" fill="#dc2626" />
      <path d="M4 70L22 62L40 74L22 80Z" fill="#ea580c" />
      <path d="M76 70L58 62L40 74L58 80Z" fill="#ea580c" />
      <path d="M40 44L58 62L76 70L58 80L40 104L22 80L4 70L22 62Z" fill="none" stroke="#fde68a" strokeWidth="1.2" />
      <circle cx="40" cy="74" r="7" fill="#fff7cc" className="fs-kandil-core" />
      {/* tassels */}
      <path d="M30 98q-2 22 0 40M40 104q0 20 0 42M50 98q2 22 0 40" stroke="#fbbf24" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="138" r="2.4" fill="#dc2626" />
      <circle cx="40" cy="146" r="2.4" fill="#16a34a" />
      <circle cx="50" cy="138" r="2.4" fill="#dc2626" />
    </svg>
  );
}

/** a clay diya (the flame is CSS: put <b/> after it) */
export function DiyaShape({ w = 28 }: { w?: number }) {
  return (
    <svg viewBox="0 0 22 10" width={w} height={(w * 10) / 22} aria-hidden>
      <path d="M1 3Q11 12 21 3Z" fill="#c2410c" />
      <path d="M1 3Q11 7 21 3" stroke="#fdba74" strokeWidth="1" fill="none" />
      <path d="M17 3.4L21.5 1.5" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** a diya with its flame and glow */
export function Diya({ k = 0, w = 28, className = "" }: { k?: number; w?: number; className?: string }) {
  return (
    <i className={`fs-diya ${className}`} style={{ "--k": k, "--w": `${w}px` } as CSSProperties}>
      <DiyaShape w={w} />
      <b />
    </i>
  );
}

/** a small marigold seen from above */
export function Marigold({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="0" cy={-r * 0.62} rx={r * 0.42} ry={r * 0.62} fill={i % 2 ? "#f59e0b" : "#fb923c"} transform={`rotate(${i * 45})`} />
      ))}
      <circle r={r * 0.34} fill="#fde047" />
    </g>
  );
}

/** a round rangoli: a dotted ring, two rings of petals that turn the other way round each other, green leaves, a flower in the middle */
export function Rangoli({ size = 120, hue = 0 }: { size?: number; hue?: number }) {
  const petals = (r: number, n: number, c: string, w: number, h: number) =>
    Array.from({ length: n }, (_, i) => <ellipse key={i} cx="60" cy={60 - r} rx={w} ry={h} fill={c} transform={`rotate(${(360 / n) * i} 60 60)`} />);
  const dots = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * 6.2832;
    return <circle key={i} cx={60 + Math.cos(a) * 56} cy={60 + Math.sin(a) * 56} r={i % 3 === 0 ? 1.6 : 1} fill="#fde68a" />;
  });
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden style={hue ? { filter: `hue-rotate(${hue}deg)` } : undefined}>
      {dots}
      <circle cx="60" cy="60" r="52" fill="none" stroke="#fb923c" strokeWidth="1.4" opacity="0.8" />
      <g className="fs-rg-a">{petals(40, 16, "#f97316", 6, 12)}</g>
      <g className="fs-rg-b">{petals(26, 12, "#ec4899", 5.6, 10.5)}</g>
      <g className="fs-rg-a">{petals(15, 8, "#facc15", 4.6, 8)}</g>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M60 38Q64 46 60 52Q56 46 60 38Z" fill="#16a34a" transform={`rotate(${i * 45 + 22.5} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="8" fill="#dc2626" />
      <circle cx="60" cy="60" r="4.5" fill="#fef3c7" />
    </svg>
  );
}

/** a garland: scallops of marigolds with bulbs that twinkle one after the other. Drawn at its real size (never stretched): `scallops` pieces of `seg` px */
export function ToranGarland({ scallops = 8, seg = 200, sag = 40, bulbSize = 3.4 }: { scallops?: number; seg?: number; sag?: number; bulbSize?: number }) {
  const W = scallops * seg;
  const H = sag * 2 + 18;
  const items: { x: number; y: number; flower: boolean }[] = [];
  const paths: string[] = [];
  for (let s = 0; s < scallops; s++) {
    const x0 = s * seg;
    const x1 = x0 + seg;
    const xm = (x0 + x1) / 2;
    paths.push(`M${x0} 4Q${xm} ${4 + sag * 2} ${x1} 4`);
    const n = 8;
    for (let i = 1; i < n; i++) {
      const t = i / n;
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * xm + t * t * x1;
      const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * (4 + sag * 2) + t * t * 4;
      items.push({ x, y, flower: i % 2 === 1 });
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#3b2f2a" strokeWidth="1.4" />
      ))}
      {items.map((it, k) =>
        it.flower ? (
          <Marigold key={k} cx={it.x} cy={it.y + 3} r={7.5} />
        ) : (
          <circle key={k} className="fs-bulb" cx={it.x} cy={it.y + 3} r={bulbSize} style={{ "--k": k } as CSSProperties} />
        ),
      )}
    </svg>
  );
}
