// Glass-and-gradient illustrations drawn with plain SVG (no image files), used inside the "Strengths" cards.

const glow = "drop-shadow-[0_18px_36px_hsl(calc(var(--th)_+_348.46)_calc(72.62%_*_var(--ts))_67.06%_/_0.35)]";

export function RingArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`${glow} ${className}`} aria-hidden>
      <defs>
        <linearGradient id="art-ring" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="hsl(calc(var(--th) + 359.64) calc(100% * var(--ts)) 89.22%)" />
          <stop offset="0.5" stopColor="hsl(calc(var(--th) + 349.44) calc(67.88% * var(--ts)) 62.16%)" />
          <stop offset="1" stopColor="hsl(calc(var(--th) + 349.87) calc(56.36% * var(--ts)) 21.57%)" />
        </linearGradient>
        <linearGradient id="art-ring-in" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="hsl(calc(var(--th) + 359.64) calc(100% * var(--ts)) 89.22%)" stopOpacity="0.9" />
          <stop offset="1" stopColor="hsl(calc(var(--th) + 349.49) calc(50.59% * var(--ts)) 33.33%)" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="66" fill="none" stroke="url(#art-ring)" strokeWidth="34" />
      <circle cx="100" cy="100" r="49" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.500" />
      <circle cx="100" cy="100" r="83" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.500" />
      <circle cx="100" cy="100" r="34" fill="hsl(calc(var(--th) + 346.97) calc(58.49% * var(--ts)) 10.39%)" stroke="url(#art-ring-in)" strokeWidth="5" />
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
          <stop offset="0" stopColor="hsl(calc(var(--th) + 359.75) calc(100% * var(--ts)) 90.59%)" />
          <stop offset="1" stopColor="hsl(calc(var(--th) + 345.08) calc(58.56% * var(--ts)) 56.47%)" />
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
          <stop offset="0" stopColor="hsl(calc(var(--th) + 348.92) calc(54.59% * var(--ts)) 40.59%)" />
          <stop offset="0.45" stopColor="hsl(calc(var(--th) + 352) calc(100% * var(--ts)) 81.37%)" />
          <stop offset="1" stopColor="hsl(calc(var(--th) + 348.2) calc(52.34% * var(--ts)) 46.08%)" />
        </linearGradient>
      </defs>
      {discs.map((i) => (
        <ellipse key={i} cx="100" cy={64 + i * 9} rx="62" ry="24" fill="url(#art-disc)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      ))}
      <ellipse cx="100" cy="64" rx="62" ry="24" fill="hsl(calc(var(--th) + 350.86) calc(84% * var(--ts)) 75.49%)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.500" />
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
