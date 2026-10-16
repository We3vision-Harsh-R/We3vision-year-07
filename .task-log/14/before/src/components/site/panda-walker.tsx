// Pando the panda as a small full-body cartoon, for the walk along the services on the home page (hero-scene.tsx). Two flat drawings: standing
// (seen from the front, it breathes and blinks) and walking (seen from the side, facing right: the legs swing, the body bobs, the head nods).
// The movement is only CSS transforms (see .pw-* in globals.css); the walk plays only while the parent has data-state="walk".

const WHITE = "#f7f3fb";
const BLACK = "#1a1620";
const FAR = "#2c2536";

/** standing, seen from the front */
export function PandaFront({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={`pw pw-front ${className}`} aria-hidden focusable="false">
      <g className="pw-breathe">
        {/* feet and body */}
        <ellipse cx="35" cy="112" rx="13" ry="7" fill={BLACK} />
        <ellipse cx="65" cy="112" rx="13" ry="7" fill={BLACK} />
        <ellipse cx="50" cy="88" rx="27" ry="25" fill={WHITE} />
        <ellipse cx="23" cy="84" rx="9" ry="18" fill={BLACK} transform="rotate(14 23 84)" />
        <ellipse cx="77" cy="84" rx="9" ry="18" fill={BLACK} transform="rotate(-14 77 84)" />
        {/* head */}
        <circle cx="27" cy="25" r="10.5" fill={BLACK} />
        <circle cx="73" cy="25" r="10.5" fill={BLACK} />
        <circle cx="27" cy="26" r="5" fill="#3a2f48" />
        <circle cx="73" cy="26" r="5" fill="#3a2f48" />
        <ellipse cx="50" cy="46" rx="31" ry="26" fill={WHITE} />
        <ellipse cx="38" cy="47" rx="8.5" ry="11.5" fill={BLACK} transform="rotate(-22 38 47)" />
        <ellipse cx="62" cy="47" rx="8.5" ry="11.5" fill={BLACK} transform="rotate(22 62 47)" />
        <g className="pm-eye">
          <circle cx="38.6" cy="46" r="4" fill="#fff" />
          <circle cx="39" cy="46.3" r="2.6" fill="#0b080e" />
          <circle cx="40" cy="45.2" r="0.9" fill="#fff" />
          <circle cx="61.4" cy="46" r="4" fill="#fff" />
          <circle cx="61" cy="46.3" r="2.6" fill="#0b080e" />
          <circle cx="62" cy="45.2" r="0.9" fill="#fff" />
        </g>
        <ellipse cx="29" cy="57" rx="5.5" ry="3.4" fill="#ff9db8" opacity="0.55" />
        <ellipse cx="71" cy="57" rx="5.5" ry="3.4" fill="#ff9db8" opacity="0.55" />
        <ellipse cx="50" cy="56" rx="9" ry="6.6" fill="#fff" />
        <ellipse cx="50" cy="53" rx="4.4" ry="3" fill="#120d17" />
        <path d="M50 56v3M44.5 60q2.8 2.6 5.5 0M50 60q2.8 2.6 5.5 0" fill="none" stroke="#2a1f33" strokeWidth="1.3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** walking, seen from the side, facing right */
export function PandaSide({ className = "" }: { className?: string }) {
  const leg = (x: number, cls: string, fill: string) => (
    <g transform={`translate(${x} 86)`}>
      <rect className={`pw-leg ${cls}`} x="-7" y="-4" width="14" height="34" rx="7" fill={fill} />
    </g>
  );
  return (
    <svg viewBox="0 0 100 120" className={`pw pw-side ${className}`} aria-hidden focusable="false">
      {/* the legs on the far side */}
      {leg(46, "pw-a", FAR)}
      {leg(72, "pw-b", FAR)}
      <g className="pw-bob">
        <circle cx="16" cy="74" r="7" fill={WHITE} />
        <ellipse cx="46" cy="76" rx="32" ry="24" fill={WHITE} />
        <ellipse cx="64" cy="78" rx="11" ry="20" fill={BLACK} />
        {/* the head */}
        <g className="pw-head">
          <circle cx="56" cy="24" r="9" fill={BLACK} />
          <circle cx="84" cy="22" r="9" fill={BLACK} />
          <circle cx="72" cy="42" r="23" fill={WHITE} />
          <ellipse cx="77" cy="40" rx="8" ry="10.5" fill={BLACK} transform="rotate(14 77 40)" />
          <circle cx="79" cy="38.6" r="3.4" fill="#fff" />
          <circle cx="79.8" cy="38.9" r="2.2" fill="#0b080e" />
          <ellipse cx="90" cy="49" rx="8.5" ry="6.5" fill="#fff" />
          <ellipse cx="96" cy="46.6" rx="3.4" ry="2.6" fill="#120d17" />
          <ellipse cx="66" cy="52" rx="5" ry="3.2" fill="#ff9db8" opacity="0.5" />
          <path d="M90 53q3 2.4 5.6 0" fill="none" stroke="#2a1f33" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      </g>
      {/* the legs on the near side */}
      {leg(34, "pw-b", BLACK)}
      {leg(62, "pw-a", BLACK)}
    </svg>
  );
}
