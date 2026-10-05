// Artwork of the timeline (sections/timeline.tsx), everything seen from ABOVE like the little guide of the brand board: the three
// founders in blazers (head, ears, shoulders, hands and feet), the park benches and the trees of the garden. All colours come
// from CSS classes (.tl-*, see globals.css) that follow the visitor's colour theme.

/** Gradients of the characters; rendered once. */
export function TimelineDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <radialGradient id="tl-hair" cx="0.38" cy="0.34" r="0.78">
          <stop offset="0" stopColor="hsl(calc(var(--th) + 358) calc(40% * var(--ts)) 48%)" />
          <stop offset="0.72" stopColor="hsl(calc(var(--th) + 349) calc(58% * var(--ts)) 25%)" />
          <stop offset="1" stopColor="hsl(calc(var(--th) + 346) calc(60% * var(--ts)) 17%)" />
        </radialGradient>
        {[
          [20, 30],
          [-24, 22],
          [60, 38],
        ].map(([o, l], i) => (
          <radialGradient key={i} id={`tl-hair${i + 1}`} cx="0.38" cy="0.34" r="0.78">
            <stop offset="0" stopColor={`hsl(calc(var(--th) + ${349 + o}) calc(44% * var(--ts)) ${l + 22}%)`} />
            <stop offset="0.72" stopColor={`hsl(calc(var(--th) + ${349 + o}) calc(52% * var(--ts)) ${l - 8}%)`} />
            <stop offset="1" stopColor={`hsl(calc(var(--th) + ${349 + o}) calc(52% * var(--ts)) ${l - 14}%)`} />
          </radialGradient>
        ))}
      </defs>
    </svg>
  );
}

/** A founder seen from above, facing down (30 x 42). The feet and the hands swing while he walks (.tl-p[data-pose="walk"]). */
export function PersonTop({ hair = 0, seated = false }: { hair?: number; seated?: boolean } = {}) {
  return (
    <svg viewBox="-15 -17 30 42" className={seated ? "tl-pt tl-seat" : "tl-pt"} fill="none" aria-hidden>
      <ellipse cx="0" cy="3" rx="13" ry="13.5" fill="#000" fillOpacity="0.3" />
      <ellipse className="tl-foot tl-foot-l" cx="-4.4" cy="14" rx="2.4" ry="3.7" />
      <ellipse className="tl-foot tl-foot-r" cx="4.4" cy="14" rx="2.4" ry="3.7" />
      <ellipse className="tl-bz" cx="0" cy="3.4" rx="10.8" ry="6" />
      <path className="tl-lapel" d="M-3.6 5.2L0 9.4l3.6-4.2" />
      <circle className="tl-btn" cx="0" cy="10.8" r="0.7" />
      <circle className="tl-hand tl-hand-l" cx="-11.4" cy="8.4" r="2.2" />
      <circle className="tl-hand tl-hand-r" cx="11.4" cy="8.4" r="2.2" />
      <circle className="tl-ear" cx="-7.9" cy="-0.8" r="1.9" />
      <circle className="tl-ear" cx="7.9" cy="-0.8" r="1.9" />
      <g className="tl-headg">
        <circle cx="0" cy="-1" r="7.4" fill={`url(#tl-hair${hair ? hair : ""})`} />
        <circle cx="0" cy="-1" r="7.4" stroke="#fff" strokeOpacity="0.18" strokeWidth="0.4" />
        <path d="M-3.8 4.2c2.4 1 5.2 1 7.6 0" stroke="#fff" strokeOpacity="0.42" strokeWidth="1" strokeLinecap="round" />
        <path d="M-4.6 -5.2c1.7-1.5 3.8-2.1 5.9-1.7" stroke="#fff" strokeOpacity="0.28" strokeWidth="0.9" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A park bench seen from above (34 x 76): the seat, the backrest along the outer edge and two armrests. The back is on the left. */
export function BenchTop() {
  return (
    <svg viewBox="0 0 34 76" className="tl-bench" fill="none" aria-hidden>
      <rect x="0" y="0" width="34" height="76" rx="6" className="tl-wood-d" />
      <rect x="1.5" y="2" width="8" height="72" rx="3" className="tl-wood-b" />
      <rect x="11" y="2" width="21" height="72" rx="4" className="tl-wood" />
      <path d="M11 20h21M11 38h21M11 56h21" className="tl-plank" />
      <rect x="11" y="0.5" width="21" height="6" rx="3" className="tl-wood-l" />
      <rect x="11" y="69.5" width="21" height="6" rx="3" className="tl-wood-l" />
    </svg>
  );
}

/** A tree crown seen from above (80 x 80). */
export function TreeTop({ tone = 0 }: { tone?: number }) {
  return (
    <svg viewBox="0 0 80 80" className="tl-tree" data-tone={tone} fill="none" aria-hidden>
      <circle cx="40" cy="42" r="37" fill="#000" fillOpacity="0.25" />
      <circle cx="40" cy="38" r="36" className="tl-crown-d" />
      <circle cx="26" cy="46" r="20" className="tl-crown" />
      <circle cx="54" cy="44" r="21" className="tl-crown" />
      <circle cx="40" cy="26" r="21" className="tl-crown-l" />
      <circle cx="31" cy="22" r="8" className="tl-crown-hi" />
      <circle cx="52" cy="50" r="2.2" className="tl-flower" />
      <circle cx="28" cy="52" r="2" className="tl-flower" />
      <circle cx="46" cy="34" r="2" className="tl-flower-b" />
      <circle cx="36" cy="58" r="1.8" className="tl-flower-b" />
    </svg>
  );
}

/** A round bush seen from above (44 x 44). */
export function BushTop() {
  return (
    <svg viewBox="0 0 44 44" className="tl-bush" fill="none" aria-hidden>
      <circle cx="22" cy="24" r="20" fill="#000" fillOpacity="0.22" />
      <circle cx="22" cy="22" r="19" className="tl-crown-d" />
      <circle cx="16" cy="25" r="11" className="tl-crown" />
      <circle cx="28" cy="20" r="12" className="tl-crown-l" />
      <circle cx="21" cy="12" r="2" className="tl-flower" />
      <circle cx="30" cy="29" r="1.8" className="tl-flower-b" />
      <circle cx="12" cy="18" r="1.6" className="tl-flower" />
    </svg>
  );
}
