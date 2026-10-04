// Glass-and-gradient illustrations drawn with plain SVG (no image files), used inside the "Strengths" cards.

const glow = "drop-shadow-[0_18px_36px_rgba(176,110,232,0.35)]";

export function RingArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`${glow} ${className}`} aria-hidden>
      <defs>
        <linearGradient id="art-ring" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f0c8ff" />
          <stop offset="0.5" stopColor="#a65de0" />
          <stop offset="1" stopColor="#3b1856" />
        </linearGradient>
        <linearGradient id="art-ring-in" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#f0c8ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#5a2a80" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="66" fill="none" stroke="url(#art-ring)" strokeWidth="34" />
      <circle cx="100" cy="100" r="49" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.500" />
      <circle cx="100" cy="100" r="83" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.500" />
      <circle cx="100" cy="100" r="34" fill="#1b0b2a" stroke="url(#art-ring-in)" strokeWidth="5" />
      <path d="M52 66a62 62 0 0 1 60-30" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function LayersArt({ className = "" }: { className?: string }) {
  const layers = [4, 3, 2, 1, 0]; // bottom first
  return (
    <svg viewBox="0 0 200 220" className={`${glow} ${className}`} aria-hidden>
      <defs>
        <linearGradient id="art-layer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2cfff" />
          <stop offset="1" stopColor="#8e4fd1" />
        </linearGradient>
      </defs>
      {layers.map((i) => (
        <polygon
          key={i}
          points={`100,${34 + i * 24} 176,${72 + i * 24} 100,${110 + i * 24} 24,${72 + i * 24}`}
          fill="url(#art-layer)"
          fillOpacity={i === 0 ? 0.95 : 0.45 + (4 - i) * 0.08}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.200"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function DiscsArt({ className = "" }: { className?: string }) {
  const discs = Array.from({ length: 9 }, (_, i) => 8 - i); // bottom first
  return (
    <svg viewBox="0 0 200 200" className={`${glow} ${className}`} aria-hidden>
      <defs>
        <linearGradient id="art-disc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6d2fa0" />
          <stop offset="0.45" stopColor="#d9a0ff" />
          <stop offset="1" stopColor="#7a38b3" />
        </linearGradient>
      </defs>
      {discs.map((i) => (
        <ellipse key={i} cx="100" cy={64 + i * 9} rx="62" ry="24" fill="url(#art-disc)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      ))}
      <ellipse cx="100" cy="64" rx="62" ry="24" fill="#c98cf5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.500" />
      <path d="M100 52c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9z" fill="#fff" fillOpacity="0.9" />
    </svg>
  );
}

export const ART = [RingArt, DiscsArt, LayersArt];

/** Square tile with a blueprint grid that holds one illustration. */
export function ArtTile({ index = 0 }: { index?: number }) {
  const Art = ART[index % ART.length];
  return (
    <div className="grid-tile grid aspect-square w-full place-items-center rounded-2xl border border-violet/10 bg-void/40">
      <Art className="h-[62%] w-[62%]" />
    </div>
  );
}
