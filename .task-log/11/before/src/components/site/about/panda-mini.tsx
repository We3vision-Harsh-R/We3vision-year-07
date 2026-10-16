// A small flat drawing of Pando the panda (for corners and cards): a round white head with black ears, tilted eye patches, shiny eyes,
// a pink nose and blush, and two black paws on the edge of whatever it peeks over. It blinks (see .pm-eye in globals.css).

export function PandaMini({ className = "", paws = true }: { className?: string; paws?: boolean }) {
  return (
    <svg viewBox={paws ? "0 0 130 104" : "12 6 106 88"} className={`pm ${className}`} aria-hidden>
      {/* ears */}
      <circle cx="30" cy="26" r="15" fill="#1a1620" />
      <circle cx="100" cy="26" r="15" fill="#1a1620" />
      <circle cx="30" cy="27" r="7" fill="#3a2f48" />
      <circle cx="100" cy="27" r="7" fill="#3a2f48" />
      {/* head */}
      <ellipse cx="65" cy="58" rx="46" ry="38" fill="#f7f3fb" />
      <ellipse cx="65" cy="40" rx="30" ry="14" fill="#fff" opacity="0.65" />
      {/* eye patches and eyes */}
      <ellipse cx="45" cy="58" rx="12" ry="16" fill="#1a1620" transform="rotate(-22 45 58)" />
      <ellipse cx="85" cy="58" rx="12" ry="16" fill="#1a1620" transform="rotate(22 85 58)" />
      <g className="pm-eye">
        <circle cx="46" cy="57" r="5.6" fill="#fff" />
        <circle cx="46.6" cy="57.4" r="3.6" fill="#0b080e" />
        <circle cx="47.8" cy="55.8" r="1.2" fill="#fff" />
        <circle cx="84" cy="57" r="5.6" fill="#fff" />
        <circle cx="84.6" cy="57.4" r="3.6" fill="#0b080e" />
        <circle cx="85.8" cy="55.8" r="1.2" fill="#fff" />
      </g>
      {/* blush, snout, nose, smile */}
      <ellipse cx="32" cy="74" rx="8" ry="5" fill="#ff9db8" opacity="0.55" />
      <ellipse cx="98" cy="74" rx="8" ry="5" fill="#ff9db8" opacity="0.55" />
      <ellipse cx="65" cy="72" rx="13" ry="9.5" fill="#fff" />
      <ellipse cx="65" cy="68" rx="6.4" ry="4.4" fill="#120d17" />
      <ellipse cx="63.4" cy="66.6" rx="1.8" ry="1" fill="#fff" opacity="0.7" />
      <path d="M65 72v4M57.5 77q3.7 3.6 7.5 0M65 77q3.8 3.6 7.5 0" fill="none" stroke="#2a1f33" strokeWidth="1.8" strokeLinecap="round" />
      {/* paws on the edge */}
      {paws && (
        <>
          <ellipse cx="34" cy="98" rx="14" ry="9" fill="#1a1620" />
          <ellipse cx="96" cy="98" rx="14" ry="9" fill="#1a1620" />
        </>
      )}
    </svg>
  );
}
