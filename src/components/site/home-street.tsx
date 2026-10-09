import type { CSSProperties } from "react";

// The little street the panda walks along on the home page (the rail under the service boxes, see hero-scene.tsx): a street lamp at every
// service (its light is the colour of that service and falls on the panda when it stands there), and between the services bamboo, pines,
// round trees, benches, flowers and a few fireflies. Everything is a small flat drawing (inline SVG) and stands on the rail; the look is in
// globals.css (.st-*). Only the light changes while the panda walks (the script sets --lit on the lamps), nothing here re-renders.

const LEAF = "hsl(calc(var(--th) + 222) calc(36% * var(--ts)) 26%)";
const LEAF_HI = "hsl(calc(var(--th) + 222) calc(34% * var(--ts)) 36%)";
const TRUNK = "hsl(calc(var(--th) + 340) calc(28% * var(--ts)) 18%)";
const WOOD = "hsl(calc(var(--th) + 336) calc(30% * var(--ts)) 24%)";

type Kind = "bench" | "tree" | "pine" | "flowers" | "bamboo" | "bush";
const KINDS: Kind[] = ["bench", "tree", "flowers", "pine", "bench", "bush", "tree", "pine"];

function Tree() {
  return (
    <svg viewBox="0 0 64 86" width="64" height="86" aria-hidden>
      <rect x="29" y="46" width="6" height="40" rx="2" fill={TRUNK} />
      <path d="M32 70l-9-9M32 62l10-9" stroke={TRUNK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="28" r="23" fill={LEAF} />
      <circle cx="17" cy="40" r="15" fill={LEAF} />
      <circle cx="47" cy="40" r="15" fill={LEAF} />
      <circle cx="26" cy="22" r="12" fill={LEAF_HI} opacity="0.75" />
      <circle cx="40" cy="30" r="7" fill={LEAF_HI} opacity="0.5" />
      {/* a string of little lights */}
      <path d="M12 34q10 10 20 3t20 3" fill="none" stroke="#1a1424" strokeWidth="0.8" />
      {[[16, 38], [24, 42], [32, 38], [41, 41], [49, 38]].map(([x, y], i) => (
        <circle key={i} className="st-bulb" style={{ "--b": i, fill: "var(--lc)" } as CSSProperties} cx={x} cy={y} r="1.9" />
      ))}
    </svg>
  );
}
function Pine() {
  return (
    <svg viewBox="0 0 48 90" width="48" height="90" aria-hidden>
      <rect x="22" y="70" width="5" height="20" fill={TRUNK} />
      <path d="M24 4L40 34H8Z" fill={LEAF} />
      <path d="M24 20L43 54H5Z" fill={LEAF} />
      <path d="M24 38L46 74H2Z" fill={LEAF} />
      <path d="M24 4L33 22L24 18Z" fill={LEAF_HI} opacity="0.6" />
      <path d="M24 20L35 42L24 38Z" fill={LEAF_HI} opacity="0.5" />
      <path d="M24 38L38 64L24 60Z" fill={LEAF_HI} opacity="0.45" />
      {[[24, 12], [17, 30], [31, 33], [12, 52], [24, 50], [36, 54], [20, 68], [32, 69]].map(([x, y], i) => (
        <circle key={i} className="st-bulb" style={{ "--b": i, fill: "var(--lc)" } as CSSProperties} cx={x} cy={y} r="1.8" />
      ))}
    </svg>
  );
}
function Bamboo() {
  const stalk = (x: number, h: number, w: number) => (
    <g key={x}>
      <rect x={x} y={92 - h} width={w} height={h} rx={w / 2} fill="hsl(calc(var(--th) + 196) calc(40% * var(--ts)) 30%)" />
      <rect x={x} y={92 - h} width={w * 0.38} height={h} rx={w / 2} fill="#fff" opacity="0.1" />
      {Array.from({ length: Math.floor(h / 22) }, (_, i) => (
        <rect key={i} x={x - 0.8} y={92 - 18 - i * 22} width={w + 1.6} height="2.4" rx="1.2" fill="hsl(calc(var(--th) + 196) calc(36% * var(--ts)) 18%)" />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 56 94" width="56" height="94" aria-hidden>
      {stalk(10, 84, 6)}
      {stalk(24, 70, 6)}
      {stalk(38, 58, 5.5)}
      <path d="M13 28q10-8 18-3q-8 6-18 3zM27 36q-10-8-19-3q8 7 19 3zM41 50q9-7 15-2q-7 6-15 2z" fill={LEAF_HI} />
    </svg>
  );
}
function Bench() {
  return (
    <svg viewBox="0 0 72 44" width="72" height="44" aria-hidden>
      <rect x="6" y="14" width="60" height="5" rx="2" fill={WOOD} />
      <rect x="6" y="6" width="60" height="4" rx="2" fill={WOOD} />
      <rect x="6" y="14" width="60" height="1.4" rx="0.7" fill="var(--lc)" opacity="0.5" />
      <rect x="10" y="19" width="4" height="22" fill="#241d2d" />
      <rect x="58" y="19" width="4" height="22" fill="#241d2d" />
      <rect x="8" y="4" width="4" height="16" fill="#241d2d" />
      <rect x="60" y="4" width="4" height="16" fill="#241d2d" />
    </svg>
  );
}
function Flowers() {
  const f = [
    [8, 16, 7],
    [18, 8, 9],
    [29, 14, 6],
    [38, 6, 8],
  ];
  return (
    <svg viewBox="0 0 48 40" width="48" height="40" aria-hidden>
      {f.map(([x, y, r], i) => (
        <g key={i}>
          <path d={`M${x} ${y + r}L${x + (i % 2 ? 2 : -2)} 38`} stroke="hsl(calc(var(--th) + 196) calc(40% * var(--ts)) 28%)" strokeWidth="1.6" />
          <circle cx={x} cy={y} r={r * 0.62} style={{ fill: "var(--lc)" }} opacity="0.95" />
          <circle cx={x} cy={y} r={r * 0.26} fill="#fff7d6" />
        </g>
      ))}
      <path d="M2 38q8-8 14-3M20 38q8-9 15-2M32 38q8-6 14-1" fill="none" stroke={LEAF_HI} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Bush() {
  return (
    <svg viewBox="0 0 56 30" width="56" height="30" aria-hidden>
      <circle cx="16" cy="18" r="12" fill={LEAF} />
      <circle cx="30" cy="14" r="14" fill={LEAF} />
      <circle cx="43" cy="19" r="11" fill={LEAF} />
      <circle cx="26" cy="9" r="7" fill={LEAF_HI} opacity="0.6" />
    </svg>
  );
}
function Lamp() {
  return (
    <svg viewBox="0 0 70 120" width="70" height="120" aria-hidden>
      <rect x="26" y="112" width="18" height="8" rx="2" fill="#241d2d" />
      <rect x="30" y="106" width="10" height="8" rx="2" fill="#2e2538" />
      <rect x="33" y="26" width="4" height="82" fill="#2e2538" />
      <rect x="33" y="26" width="1.4" height="82" fill="#fff" opacity="0.14" />
      <path d="M35 30Q35 14 17 17" fill="none" stroke="#2e2538" strokeWidth="3.6" strokeLinecap="round" />
      {/* the lantern: a cap, a glowing glass and a bulb */}
      <path d="M4 17h20l-3-6H7Z" fill="#241d2d" />
      <path d="M6 17h16l-2 8H8Z" style={{ fill: "var(--lc)" }} opacity="0.95" />
      <path d="M8 17h12l-1 6H9Z" fill="#fff" opacity="0.7" />
      <rect x="7" y="24" width="14" height="2.4" rx="1" fill="#241d2d" />
    </svg>
  );
}

const ITEM: Record<Kind, () => React.JSX.Element> = { tree: Tree, pine: Pine, bamboo: Bamboo, bench: Bench, flowers: Flowers, bush: Bush };

/** the street of n services: a lamp at every service, decorations in between (accents: the colour of every service) */
export function Street({ n, accents }: { n: number; accents: string[] }) {
  const gaps = Math.max(0, n - 1);
  const decor: { k: Kind; at: number; dx: number; side: number }[] = [
    { k: "bamboo", at: -0.5, dx: -6, side: 0 },
    ...Array.from({ length: gaps }, (_, j) => ({ k: KINDS[j % KINDS.length], at: j + 0.5, dx: 30, side: 0 })),
    { k: "bamboo", at: n - 0.5, dx: 22, side: 0 },
    { k: "pine", at: n - 0.5, dx: 70, side: 0 },
  ];
  return (
    <span aria-hidden className="st">
      {/* the pavement of the street, with a kerb */}
      <i className="st-walk" />
      {decor.map((d, i) => (
        <i
          key={i}
          className="st-item"
          data-k={d.k}
          style={{ "--i": d.at, "--dx": `${d.dx}px`, "--lc": accents[Math.max(0, Math.min(n - 1, Math.round(d.at)))] } as CSSProperties}
        >
          {ITEM[d.k]()}
        </i>
      ))}
      {/* a lamp at every service: its light is the colour of the service */}
      {Array.from({ length: n }, (_, i) => (
        <i key={i} className="st-lamp" data-i={i} style={{ "--i": i, "--lc": accents[i % accents.length], "--lit": 0.3 } as CSSProperties}>
          <b className="st-pool" />
          <b className="st-cone" />
          <Lamp />
        </i>
      ))}
      {/* fireflies */}
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} className="st-fly" style={{ "--f": i, "--lc": accents[i % accents.length] } as CSSProperties} />
      ))}
    </span>
  );
}
