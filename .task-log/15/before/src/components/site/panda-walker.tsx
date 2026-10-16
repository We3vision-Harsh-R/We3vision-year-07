// Pando the panda as a small full-body cartoon, for the walk along the services on the home page (hero-scene.tsx). Two drawings in the same
// flat style with soft shading: standing (seen from the front, it breathes, blinks and waves now and then) and walking (a waddle in profile,
// facing right, with a round face turned to the front). The movement is only CSS transforms (see .pw-* in globals.css); the walk plays only
// while the parent has data-state="walk".

const Defs = ({ p }: { p: string }) => (
  <defs>
    <radialGradient id={`${p}w`} cx="38%" cy="28%" r="85%">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.65" stopColor="#f4eefa" />
      <stop offset="1" stopColor="#ddd2ec" />
    </radialGradient>
    <linearGradient id={`${p}k`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#40364d" />
      <stop offset="0.55" stopColor="#1f1927" />
      <stop offset="1" stopColor="#141019" />
    </linearGradient>
  </defs>
);

/** the face: the same on both drawings (centre cx, cy; size s) */
function Face({ p, cx, cy, s = 1, look = 0 }: { p: string; cx: number; cy: number; s?: number; look?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {/* ears */}
      <circle cx="-31" cy="-24" r="11.5" fill={`url(#${p}k)`} />
      <circle cx="31" cy="-24" r="11.5" fill={`url(#${p}k)`} />
      <circle cx="-31" cy="-23" r="5.2" fill="#5d4a6e" />
      <circle cx="31" cy="-23" r="5.2" fill="#5d4a6e" />
      {/* head */}
      <ellipse cx="0" cy="0" rx="36" ry="30" fill={`url(#${p}w)`} />
      {/* eye patches, eyes */}
      <ellipse cx="-14" cy="2" rx="9.4" ry="12.4" fill={`url(#${p}k)`} transform="rotate(-20 -14 2)" />
      <ellipse cx="14" cy="2" rx="9.4" ry="12.4" fill={`url(#${p}k)`} transform="rotate(20 14 2)" />
      <g className="pm-eye">
        <circle cx={-14 + look} cy="1" r="4.6" fill="#fff" />
        <circle cx={-13.4 + look} cy="1.5" r="3.1" fill="#0b080e" />
        <circle cx={-12.4 + look} cy="0.2" r="1.1" fill="#fff" />
        <circle cx={14 + look} cy="1" r="4.6" fill="#fff" />
        <circle cx={14.6 + look} cy="1.5" r="3.1" fill="#0b080e" />
        <circle cx={15.6 + look} cy="0.2" r="1.1" fill="#fff" />
      </g>
      {/* cheeks, snout, nose, mouth */}
      <ellipse cx="-23" cy="14" rx="6" ry="3.8" fill="#ff9db8" opacity="0.55" />
      <ellipse cx="23" cy="14" rx="6" ry="3.8" fill="#ff9db8" opacity="0.55" />
      <ellipse cx="0" cy="13" rx="10" ry="7.4" fill="#fff" />
      <ellipse cx="0" cy="9.6" rx="4.8" ry="3.3" fill="#120d17" />
      <ellipse cx="-1.4" cy="8.4" rx="1.6" ry="0.9" fill="#fff" opacity="0.75" />
      <path d="M0 12.6v3.2M-5.2 16.8q2.6 2.8 5.2 0M0 16.8q2.6 2.8 5.2 0" fill="none" stroke="#2a1f33" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

/** standing, seen from the front */
export function PandaFront({ className = "" }: { className?: string }) {
  const p = "pwf";
  return (
    <svg viewBox="0 0 120 130" preserveAspectRatio="xMidYMax meet" className={`pw pw-front ${className}`} aria-hidden focusable="false">
      <Defs p={p} />
      <ellipse cx="60" cy="125" rx="36" ry="4.5" fill="#000" opacity="0.3" />
      <g className="pw-breathe">
        <ellipse cx="42" cy="118" rx="14" ry="8.5" fill={`url(#${p}k)`} />
        <ellipse cx="78" cy="118" rx="14" ry="8.5" fill={`url(#${p}k)`} />
        <ellipse cx="60" cy="92" rx="31" ry="29" fill={`url(#${p}w)`} />
        <ellipse cx="60" cy="98" rx="19" ry="18" fill="#fff" opacity="0.55" />
        {/* the arms: the left one rests, the right one waves now and then */}
        <ellipse cx="29" cy="90" rx="10.5" ry="21" fill={`url(#${p}k)`} transform="rotate(14 29 90)" />
        <g className="pw-wave">
          <ellipse cx="91" cy="90" rx="10.5" ry="21" fill={`url(#${p}k)`} transform="rotate(-14 91 90)" />
        </g>
        <Face p={p} cx={60} cy={48} s={1.02} />
      </g>
    </svg>
  );
}

/** walking, a waddle in profile facing right (the body in profile, the round face to the front) */
export function PandaSide({ className = "" }: { className?: string }) {
  const p = "pws";
  const leg = (x: number, cls: string, fill: string) => (
    <g transform={`translate(${x} 86)`}>
      <rect className={`pw-leg ${cls}`} x="-9" y="-6" width="18" height="40" rx="9" fill={fill} />
    </g>
  );
  return (
    <svg viewBox="0 0 140 124" preserveAspectRatio="xMidYMax meet" className={`pw pw-side ${className}`} aria-hidden focusable="false">
      <Defs p={p} />
      <ellipse cx="70" cy="120" rx="50" ry="4.5" fill="#000" opacity="0.3" />
      {/* the legs: the far ones are darker; they are behind the body (the hips are hidden) */}
      {leg(52, "pw-a", "#241d2d")}
      {leg(94, "pw-b", "#241d2d")}
      {leg(38, "pw-b", `url(#${p}k)`)}
      {leg(80, "pw-a", `url(#${p}k)`)}
      <g className="pw-sway">
        <circle cx="19" cy="68" r="9" fill={`url(#${p}w)`} />
        <ellipse cx="62" cy="64" rx="42" ry="29" fill={`url(#${p}w)`} />
        <ellipse cx="86" cy="66" rx="13" ry="27" fill={`url(#${p}k)`} />
        <g className="pw-head">
          <Face p={p} cx={100} cy={46} look={1.6} />
        </g>
      </g>
    </svg>
  );
}
