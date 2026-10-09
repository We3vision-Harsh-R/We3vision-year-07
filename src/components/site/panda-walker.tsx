// Pando the panda as a small full-body cartoon, for the walk along the services on the home page (hero-scene.tsx). Two drawings in the same
// flat style with soft shading: standing (seen from the front, it breathes, blinks and waves now and then) and walking (a waddle in profile,
// facing right, with a round face turned to the front). Details: fur tufts, toe lines, paw pads, a scarf in the colour of the service it
// stands at, and the colour of the street lamp it walks under falls on it from above (the gradient "lit", opacity --plit set by the script).
// The movement is only CSS transforms (see .pw-* in globals.css); the walk plays only while the parent has data-state="walk".

const Defs = ({ p }: { p: string }) => (
  <defs>
    <radialGradient id={`${p}w`} cx="38%" cy="28%" r="85%">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.65" stopColor="#f4eefa" />
      <stop offset="1" stopColor="#d8cce9" />
    </radialGradient>
    <linearGradient id={`${p}k`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#42384f" />
      <stop offset="0.55" stopColor="#1f1927" />
      <stop offset="1" stopColor="#141019" />
    </linearGradient>
    {/* the light of the lamp: the colour of the service, strongest at the top */}
    <linearGradient id={`${p}l`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style={{ stopColor: "var(--ac)", stopOpacity: 0.85 }} />
      <stop offset="0.7" style={{ stopColor: "var(--ac)", stopOpacity: 0.12 }} />
      <stop offset="1" style={{ stopColor: "var(--ac)", stopOpacity: 0 }} />
    </linearGradient>
  </defs>
);

const SCARF = { fill: "var(--ac)" } as const;

/** the face: the same on both drawings (centre cx, cy; size s) */
function Face({ p, cx, cy, s = 1, look = 0 }: { p: string; cx: number; cy: number; s?: number; look?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {/* ears */}
      <circle cx="-31" cy="-24" r="11.5" fill={`url(#${p}k)`} />
      <circle cx="31" cy="-24" r="11.5" fill={`url(#${p}k)`} />
      <circle cx="-31" cy="-23" r="5.6" fill="#6b5480" />
      <circle cx="31" cy="-23" r="5.6" fill="#6b5480" />
      <circle cx="-33" cy="-26" r="1.8" fill="#fff" opacity="0.35" />
      <circle cx="29" cy="-26" r="1.8" fill="#fff" opacity="0.35" />
      {/* head, with a soft shine on the forehead and tufts of fur at the cheeks */}
      <ellipse cx="0" cy="0" rx="36" ry="30" fill={`url(#${p}w)`} stroke="#120d17" strokeOpacity="0.35" strokeWidth="0.9" />
      <ellipse cx="-6" cy="-16" rx="15" ry="6" fill="#fff" opacity="0.7" />
      <path d="M-36 6q-5 3-3 9M-35 13q-5 2-3.4 8M36 6q5 3 3 9M35 13q5 2 3.4 8" fill="none" stroke="#cbbde0" strokeWidth="1.3" strokeLinecap="round" />
      {/* eye patches, eyes */}
      <ellipse cx="-14" cy="2" rx="9.6" ry="12.6" fill={`url(#${p}k)`} transform="rotate(-20 -14 2)" />
      <ellipse cx="14" cy="2" rx="9.6" ry="12.6" fill={`url(#${p}k)`} transform="rotate(20 14 2)" />
      <g className="pm-eye">
        <circle cx={-14 + look} cy="1" r="4.8" fill="#fff" />
        <circle cx={-13.4 + look} cy="1.6" r="3.3" fill="#0b080e" />
        <circle cx={-12.3 + look} cy="0.2" r="1.2" fill="#fff" />
        <circle cx={-14.6 + look} cy="3" r="0.7" fill="#fff" opacity="0.8" />
        <circle cx={14 + look} cy="1" r="4.8" fill="#fff" />
        <circle cx={14.6 + look} cy="1.6" r="3.3" fill="#0b080e" />
        <circle cx={15.7 + look} cy="0.2" r="1.2" fill="#fff" />
        <circle cx={13.4 + look} cy="3" r="0.7" fill="#fff" opacity="0.8" />
      </g>
      {/* cheeks, snout, nose, mouth */}
      <ellipse cx="-23" cy="14" rx="6" ry="3.8" fill="#ff9db8" opacity="0.6" />
      <ellipse cx="23" cy="14" rx="6" ry="3.8" fill="#ff9db8" opacity="0.6" />
      <ellipse cx="0" cy="13" rx="10" ry="7.4" fill="#fff" />
      <ellipse cx="0" cy="9.6" rx="4.9" ry="3.4" fill="#120d17" />
      <ellipse cx="-1.4" cy="8.4" rx="1.7" ry="0.9" fill="#fff" opacity="0.8" />
      <path d="M0 12.8v3.2M-5.2 17q2.6 2.8 5.2 0M0 17q2.6 2.8 5.2 0" fill="none" stroke="#2a1f33" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="0" cy="19.4" rx="2.2" ry="1.3" fill="#ff8aa8" opacity="0.75" />
    </g>
  );
}

/** standing, seen from the front */
export function PandaFront({ className = "" }: { className?: string }) {
  const p = "pwf";
  return (
    <svg viewBox="0 0 120 130" preserveAspectRatio="xMidYMax meet" className={`pw pw-front ${className}`} aria-hidden focusable="false">
      <Defs p={p} />
      <g className="pw-breathe">
        {/* feet, with toes and pads */}
        <ellipse cx="42" cy="118" rx="14" ry="8.5" fill={`url(#${p}k)`} />
        <ellipse cx="78" cy="118" rx="14" ry="8.5" fill={`url(#${p}k)`} />
        <path d="M34 121v-3M39.5 123v-4M45 123v-4M50.5 121v-3M70 121v-3M75.5 123v-4M81 123v-4M86.5 121v-3" fill="none" stroke="#554966" strokeWidth="1.3" strokeLinecap="round" />
        {/* body: a lighter belly and the shadow of the head */}
        <ellipse cx="60" cy="92" rx="31" ry="29" fill={`url(#${p}w)`} stroke="#120d17" strokeOpacity="0.3" strokeWidth="0.9" />
        <ellipse cx="60" cy="99" rx="19" ry="18" fill="#fff" opacity="0.6" />
        <ellipse cx="60" cy="72" rx="26" ry="7" fill="#9d8bb8" opacity="0.28" />
        {/* arms: the left one rests, the right one waves now and then */}
        <ellipse cx="29" cy="90" rx="10.5" ry="21" fill={`url(#${p}k)`} transform="rotate(14 29 90)" />
        <path d="M24 106q-1 4 1 6M29 108q0 4 2 6" fill="none" stroke="#554966" strokeWidth="1.2" strokeLinecap="round" />
        <g className="pw-wave">
          <ellipse cx="91" cy="90" rx="10.5" ry="21" fill={`url(#${p}k)`} transform="rotate(-14 91 90)" />
          <path d="M97 106q1 4-1 6M92 108q0 4-2 6" fill="none" stroke="#554966" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        {/* the scarf, in the colour of the service */}
        <path d="M32 76Q60 94 88 76L87 85Q60 102 33 85Z" style={SCARF} />
        <path d="M32 76Q60 94 88 76L87 79Q60 97 33 79Z" fill="#fff" opacity="0.22" />
        <path d="M74 91l9 19-10-3z" style={SCARF} />
        <path d="M74 91l9 19-3-1z" fill="#000" opacity="0.16" />
        <Face p={p} cx={60} cy={48} s={1.02} />
        {/* the light of the lamp falls on the head and the shoulders */}
        <g className="pw-lit" aria-hidden>
          <ellipse cx="60" cy="48" rx="36.7" ry="30.6" fill={`url(#${p}l)`} />
          <ellipse cx="60" cy="92" rx="31" ry="29" fill={`url(#${p}l)`} />
        </g>
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
      <path className={`pw-leg ${cls}`} d="M-4 31v-3M0 32v-4M4 31v-3" fill="none" stroke="#554966" strokeWidth="1.2" strokeLinecap="round" opacity={fill.startsWith("url") ? 1 : 0.6} />
    </g>
  );
  return (
    <svg viewBox="0 0 140 124" preserveAspectRatio="xMidYMax meet" className={`pw pw-side ${className}`} aria-hidden focusable="false">
      <Defs p={p} />
      {/* the legs: the far ones are darker; they are behind the body (the hips are hidden) */}
      {leg(52, "pw-a", "#241d2d")}
      {leg(94, "pw-b", "#241d2d")}
      {leg(38, "pw-b", `url(#${p}k)`)}
      {leg(80, "pw-a", `url(#${p}k)`)}
      <g className="pw-sway">
        <circle cx="19" cy="68" r="9" fill={`url(#${p}w)`} stroke="#120d17" strokeOpacity="0.3" strokeWidth="0.9" />
        <ellipse cx="62" cy="64" rx="42" ry="29" fill={`url(#${p}w)`} stroke="#120d17" strokeOpacity="0.3" strokeWidth="0.9" />
        <ellipse cx="60" cy="78" rx="30" ry="14" fill="#fff" opacity="0.5" />
        <ellipse cx="86" cy="66" rx="13" ry="27" fill={`url(#${p}k)`} />
        <ellipse cx="86" cy="56" rx="4" ry="10" fill="#fff" opacity="0.1" />
        <ellipse cx="62" cy="64" rx="42" ry="29" fill={`url(#${p}l)`} className="pw-lit" />
        {/* the scarf, with a tail that flutters behind */}
        <g className="pw-tail">
          <path d="M84 74q-12 3-22 13q7-2 13 1q3-6 13-8z" style={SCARF} />
          <path d="M84 74q-12 3-22 13l5-1q8-9 17-9z" fill="#fff" opacity="0.22" />
        </g>
        <path d="M82 68Q101 88 121 70L120 79Q101 98 83 78Z" style={SCARF} />
        <path d="M82 68Q101 88 121 70L120 73Q101 91 83 71Z" fill="#fff" opacity="0.22" />
        <g className="pw-head">
          <Face p={p} cx={100} cy={46} look={1.6} />
          <ellipse cx="100" cy="46" rx="36.7" ry="30.6" fill={`url(#${p}l)`} className="pw-lit" />
        </g>
      </g>
    </svg>
  );
}
