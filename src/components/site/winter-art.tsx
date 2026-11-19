import "@/styles/winter.css"; // (the styles of the whole winter world: loaded with these drawings, not with every page)

/**
 * The little drawings of the winter world (tasks 153 + 154): a snowman, a snowball, a snow house with a fir tree, and the gradient they share.
 * `gid` is the id of the gradient (every layer defines its own, so a layer that is hidden never takes the paint of another one away).
 * The class names (wm-...) are styled at the end of globals.css.
 */

export function WinterDefs({ gid }: { gid: string }) {
  return (
    <svg width="0" height="0" className="wm-defs" aria-hidden>
      <defs>
        <radialGradient id={gid} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#eef4ff" />
          <stop offset="1" stopColor="#b8cbea" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Snowman({ gid }: { gid: string }) {
  const g = `url(#${gid})`;
  return (
    <svg viewBox="0 0 44 58" aria-hidden>
      <ellipse cx="22" cy="57" rx="15" ry="1.8" fill="rgba(0,0,0,0.28)" />
      <g stroke="#6b4a33" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M13.8 26 L4 21 M7.6 22.8 L5 26" />
        <g className="wm-arm">
          <path d="M30.2 26 L40 20.5 M36 22.8 L39 25.8" />
        </g>
      </g>
      <circle cx="22" cy="44.5" r="12.5" fill={g} />
      <circle cx="22" cy="27" r="9.3" fill={g} />
      <circle cx="22" cy="13" r="6.9" fill={g} />
      <rect x="14.2" y="18" width="15.6" height="3.6" rx="1.8" fill="#d8483f" />
      <rect x="25.6" y="19.6" width="3.8" height="9.5" rx="1.5" fill="#bf3a33" />
      <g className="wm-eyes" fill="#22252f">
        <circle cx="19.5" cy="11.6" r="1" />
        <circle cx="24.5" cy="11.6" r="1" />
      </g>
      <path d="M22 13.2 L28.2 14.4 L22 15.4 Z" fill="#f08a2c" />
      <g fill="#22252f">
        <circle cx="19.2" cy="16.4" r="0.5" />
        <circle cx="20.9" cy="17.4" r="0.5" />
        <circle cx="23.1" cy="17.4" r="0.5" />
        <circle cx="24.8" cy="16.4" r="0.5" />
        <circle cx="22" cy="26.2" r="0.95" />
        <circle cx="22" cy="30.4" r="0.95" />
        <circle cx="22" cy="41" r="1.05" />
        <circle cx="22" cy="46" r="1.05" />
      </g>
    </svg>
  );
}

export function Ball({ s, gid }: { s: number; gid: string }) {
  const R = s / 2;
  return (
    <svg viewBox={`0 0 ${s} ${s}`} aria-hidden>
      <ellipse cx={R} cy={s - 0.5} rx={R * 0.8} ry="1.5" fill="rgba(0,0,0,0.28)" />
      <circle cx={R} cy={R} r={R} fill={`url(#${gid})`} />
      <g className="wm-roll" fill="rgba(150,178,222,0.35)">
        <circle cx={R * 0.7} cy={R * 0.8} r={R * 0.16} />
        <circle cx={R * 1.3} cy={R * 1.15} r={R * 0.12} />
        <circle cx={R * 0.95} cy={R * 1.45} r={R * 0.1} />
      </g>
    </svg>
  );
}

export function House() {
  return (
    <svg viewBox="0 0 190 62" aria-hidden>
      <ellipse cx="95" cy="60.5" rx="92" ry="2.4" fill="rgba(235,243,255,0.9)" />
      {/* the little fir tree on the right */}
      <g transform="translate(146 0)">
        <rect x="21.5" y="52" width="5" height="8" fill="#5a3b2c" />
        <polygon points="24,14 13,32 35,32" fill="#2f6a4f" />
        <polygon points="24,24 9,44 39,44" fill="#2a6046" />
        <polygon points="24,34 5,57 43,57" fill="#255640" />
        <path d="M24 14 L18 23 Q21 21 24 23 Q27 21 30 23 Z" fill="#f4f8ff" />
        <path d="M24 24 L14 37 Q19 34 24 37 Q29 34 34 37 Z" fill="#f4f8ff" />
        <path d="M24 34 L11 50 Q18 46 24 50 Q30 46 37 50 Z" fill="#f4f8ff" />
        <circle cx="24" cy="12.5" r="1.8" fill="#ffd37a" className="wm-star" />
      </g>
      {/* chimney with smoke */}
      <rect x="98" y="10" width="11" height="22" fill="#6b4a3a" />
      <rect x="96" y="8" width="15" height="5" rx="2.5" fill="#f4f8ff" />
      <g className="wm-smoke" fill="rgba(235,243,255,0.75)">
        <circle cx="103.5" cy="6" r="2.6" />
        <circle cx="103.5" cy="6" r="2.6" />
        <circle cx="103.5" cy="6" r="2.6" />
      </g>
      {/* walls */}
      <rect x="34" y="32" width="88" height="27" fill="#7a5238" />
      <g stroke="rgba(0,0,0,0.16)" strokeWidth="0.8">
        <path d="M46 32 V59 M58 32 V59 M70 32 V59 M82 32 V59 M94 32 V59 M106 32 V59 M118 32 V59" />
      </g>
      {/* windows (they glow) */}
      <g className="wm-win">
        <rect x="40" y="39" width="17" height="13" rx="1.5" fill="#ffd37a" />
        <rect x="99" y="39" width="17" height="13" rx="1.5" fill="#ffd37a" />
      </g>
      <g stroke="#5b3a28" strokeWidth="1.4">
        <path d="M48.5 39 V52 M40 45.5 H57 M107.5 39 V52 M99 45.5 H116" />
      </g>
      <rect x="39" y="52" width="19" height="2.6" rx="1.3" fill="#f4f8ff" />
      <rect x="98" y="52" width="19" height="2.6" rx="1.3" fill="#f4f8ff" />
      {/* door */}
      <rect x="68" y="40" width="16" height="19" rx="2" fill="#4f3123" />
      <circle cx="80.5" cy="50" r="0.9" fill="#ffd37a" />
      {/* roof with thick snow */}
      <polygon points="26,34 78,8 130,34" fill="#4a3126" />
      <path d="M24 35 L78 6.5 L132 35 Q124 41 116 35 Q108 41 100 35 Q92 41 84 35 Q76 41 68 35 Q60 41 52 35 Q44 41 36 35 Q30 40 24 35 Z" fill="#f4f8ff" />
      <path d="M30 36.5 Q36 41 42 36.5 M56 36.5 Q62 41 68 36.5 M104 36.5 Q110 41 116 36.5" fill="none" stroke="rgba(120,150,205,0.45)" strokeWidth="1" />
      {/* warm lights along the eave */}
      <g className="wm-lights">
        <circle cx="38" cy="38.6" r="1.3" fill="#ffd37a" />
        <circle cx="50" cy="39.6" r="1.3" fill="#ffb066" />
        <circle cx="62" cy="38.6" r="1.3" fill="#ffd37a" />
        <circle cx="74" cy="39.6" r="1.3" fill="#ffb066" />
        <circle cx="86" cy="38.6" r="1.3" fill="#ffd37a" />
        <circle cx="98" cy="39.6" r="1.3" fill="#ffb066" />
        <circle cx="110" cy="38.6" r="1.3" fill="#ffd37a" />
        <circle cx="122" cy="39.6" r="1.3" fill="#ffb066" />
      </g>
    </svg>
  );
}
