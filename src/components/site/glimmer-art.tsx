import "@/styles/glimmer.css";

// GLIMMER ART (owner, 2026-11-12): small grainy, softly glowing night illustrations drawn as SVG in the theme colours (the owner's references were the style: a glowing
// plant, mushrooms, a moon, a fluffy tree; these drawings are our own). The grain is an SVG filter, the glow a radial gradient, the sparkles twinkle (opacity) and
// the butterflies flutter (transform). Used where a screen is quiet: the lost / error pages, a sent message, a sent job application. No script, no state.
// Styles: styles/glimmer.css ("gm-").

export type GlimmerName = "plant" | "mushrooms" | "moon" | "tree";

const SPARKS: Record<GlimmerName, [number, number, number][]> = {
  plant: [[92, 80, 2.4], [150, 52, 1.8], [236, 44, 2.2], [318, 150, 2.4], [60, 210, 1.8], [340, 230, 1.6], [120, 120, 1.6], [270, 78, 1.6]],
  mushrooms: [[80, 90, 2], [330, 70, 2.4], [250, 40, 1.6], [60, 200, 1.8], [350, 210, 1.8], [190, 60, 1.6], [300, 130, 1.6]],
  moon: [[70, 80, 2.2], [120, 40, 1.8], [330, 70, 2], [350, 170, 1.8], [60, 180, 1.6], [250, 36, 1.8]],
  tree: [[300, 80, 2.4], [70, 70, 1.8], [340, 150, 2], [230, 50, 1.6], [90, 250, 1.4]],
};

function Sparks({ art }: { art: GlimmerName }) {
  return (
    <g className="gm-sparks">
      {SPARKS[art].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} className="gm-tw" style={{ "--d": (i % 5) * 0.7 } as React.CSSProperties} />
      ))}
    </g>
  );
}

function Butterfly({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="gm-bf">
        <g className="gm-wing">
          <path d="M0 0C-8-16-24-14-22-2C-21 8-8 8 0 0Z" />
          <path d="M0 0C8-16 24-14 22-2C21 8 8 8 0 0Z" />
        </g>
      </g>
    </g>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-lv`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" className="gm-s-blue" />
        <stop offset="1" className="gm-s-lav" />
      </linearGradient>
      <linearGradient id={`${id}-lv2`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="gm-s-mid" />
        <stop offset="1" className="gm-s-pink" />
      </linearGradient>
      <linearGradient id={`${id}-pot`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className="gm-s-pink" />
        <stop offset="0.55" className="gm-s-deep" />
        <stop offset="1" className="gm-s-lav" />
      </linearGradient>
      <radialGradient id={`${id}-gr`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" className="gm-s-white" />
        <stop offset="0.45" className="gm-s-lav" stopOpacity="0.6" />
        <stop offset="1" className="gm-s-lav" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" className="gm-s-lav" stopOpacity="0.55" />
        <stop offset="1" className="gm-s-lav" stopOpacity="0" />
      </radialGradient>
      {/* the grain: noise that eats into the edges and the fill of what it is applied to */}
      <filter id={`${id}-grain`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 3.4 -0.85" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" />
      </filter>
      <filter id={`${id}-fluff`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="b" />
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="9" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 3.6 -1" result="m" />
        <feComposite in="b" in2="m" operator="in" />
      </filter>
      <g id={`${id}-fern`}>
        <path d="M0 0V-64" className="gm-stem" />
        {[-14, -30, -46].map((y) => (
          <g key={y}>
            <ellipse cx="-10" cy={y} rx="11" ry="4" transform={`rotate(-35 -10 ${y})`} />
            <ellipse cx="10" cy={y - 4} rx="11" ry="4" transform={`rotate(35 10 ${y - 4})`} />
          </g>
        ))}
        <ellipse cx="0" cy="-70" rx="4" ry="9" />
      </g>
    </defs>
  );
}

function Plant({ id }: { id: string }) {
  return (
    <>
      <ellipse cx="200" cy="368" rx="160" ry="28" fill={`url(#${id}-gr)`} className="gm-pulse" />
      <g filter={`url(#${id}-grain)`}>
        <rect x="205" y="100" width="46" height="150" rx="23" transform="rotate(8 228 260)" fill={`url(#${id}-lv2)`} opacity="0.75" />
        <rect x="118" y="130" width="52" height="150" rx="26" transform="rotate(-14 144 280)" fill={`url(#${id}-lv)`} />
        <rect x="232" y="120" width="52" height="160" rx="26" transform="rotate(16 258 280)" fill={`url(#${id}-lv)`} />
        <rect x="82" y="190" width="48" height="110" rx="24" transform="rotate(-32 106 300)" fill={`url(#${id}-lv2)`} />
        <rect x="272" y="185" width="48" height="115" rx="24" transform="rotate(30 296 300)" fill={`url(#${id}-lv2)`} />
        <rect x="172" y="66" width="56" height="196" rx="28" fill={`url(#${id}-lv)`} />
        <g className="gm-fern">
          <use href={`#${id}-fern`} transform="translate(150 280) rotate(-24)" />
          <use href={`#${id}-fern`} transform="translate(200 284) scale(1.1)" />
          <use href={`#${id}-fern`} transform="translate(250 280) rotate(24)" />
          <use href={`#${id}-fern`} transform="translate(226 190) scale(0.8) rotate(8)" />
        </g>
        <rect x="124" y="268" width="152" height="26" rx="7" fill={`url(#${id}-pot)`} />
        <path d="M134 294H266L252 356Q250 366 238 366H162Q150 366 148 356Z" fill={`url(#${id}-pot)`} />
      </g>
      <Sparks art="plant" />
      <Butterfly x={310} y={92} s={1.1} />
      <Butterfly x={104} y={128} s={0.8} />
    </>
  );
}

function Mushrooms({ id }: { id: string }) {
  const shrooms: [number, number, number][] = [
    [236, 170, 1.1],
    [196, 232, 0.9],
    [268, 244, 0.8],
    [300, 210, 0.7],
    [160, 300, 0.6],
    [322, 300, 0.55],
  ];
  return (
    <>
      <ellipse cx="200" cy="368" rx="170" ry="28" fill={`url(#${id}-gr)`} className="gm-pulse" />
      <g filter={`url(#${id}-grain)`}>
        <rect x="64" y="210" width="44" height="150" rx="22" transform="rotate(-8 86 360)" fill={`url(#${id}-lv2)`} opacity="0.7" />
        <rect x="86" y="240" width="64" height="124" rx="32" fill={`url(#${id}-lv)`} opacity="0.85" />
        <rect x="318" y="238" width="58" height="126" rx="29" fill={`url(#${id}-lv)`} opacity="0.85" />
        <path d="M120 364V170Q120 104 168 104Q216 104 216 170V364Z" fill={`url(#${id}-lv)`} />
        <rect x="226" y="236" width="82" height="128" rx="41" fill={`url(#${id}-lv2)`} opacity="0.8" />
      </g>
      <circle cx="148" cy="170" r="7" className="gm-eye" />
      <circle cx="180" cy="170" r="7" className="gm-eye" />
      <circle cx="149" cy="171" r="2.8" className="gm-pupil" />
      <circle cx="181" cy="171" r="2.8" className="gm-pupil" />
      {shrooms.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <circle cx="0" cy="-8" r="34" fill={`url(#${id}-halo)`} className="gm-pulse" style={{ "--d": i * 0.4 } as React.CSSProperties} />
          <path d={`M0 0C-8 ${40 + i * 4} 8 ${84 + i * 4} 0 ${130}`} className="gm-stem" />
          <path d="M-24 2Q0-38 24 2Q0 10-24 2Z" className="gm-cap" />
        </g>
      ))}
      <Sparks art="mushrooms" />
      <Butterfly x={300} y={112} s={1} />
    </>
  );
}

function Moon({ id }: { id: string }) {
  return (
    <>
      <circle cx="220" cy="190" r="150" fill={`url(#${id}-halo)`} className="gm-pulse" />
      <ellipse cx="200" cy="372" rx="170" ry="26" fill={`url(#${id}-gr)`} className="gm-pulse" />
      <g filter={`url(#${id}-grain)`}>
        <path d="M232 70C150 76 96 140 96 218C96 306 164 366 250 360C300 356 340 330 358 288C320 316 276 320 240 298C186 266 176 170 232 70Z" fill={`url(#${id}-lv)`} className="gm-moon" />
        {[
          [74, 280, 26, 90],
          [112, 306, 22, 66],
          [304, 296, 26, 76],
          [338, 272, 30, 100],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx={w / 2} fill={`url(#${id}-lv2)`} />
        ))}
        <g opacity="0.9">
          <circle cx="250" cy="120" r="20" className="gm-cloud" />
          <circle cx="276" cy="124" r="26" className="gm-cloud" />
          <circle cx="306" cy="130" r="18" className="gm-cloud" />
          <rect x="236" y="128" width="84" height="20" rx="10" className="gm-cloud" />
        </g>
      </g>
      <Sparks art="moon" />
      <Butterfly x={100} y={150} s={0.8} />
    </>
  );
}

function Tree({ id }: { id: string }) {
  return (
    <>
      <circle cx="270" cy="70" r="64" fill={`url(#${id}-halo)`} className="gm-pulse" />
      <g filter={`url(#${id}-grain)`}>
        <path d="M0 322Q110 262 220 304T400 292V400H0Z" fill={`url(#${id}-lv2)`} opacity="0.85" />
        <path d="M0 360Q130 316 250 348T400 340V400H0Z" fill={`url(#${id}-lv)`} />
      </g>
      <path d="M160 322C148 270 176 248 158 196" className="gm-trunk" />
      <g filter={`url(#${id}-fluff)`}>
        <circle cx="150" cy="104" r="50" fill={`url(#${id}-lv)`} />
        <circle cx="106" cy="150" r="42" fill={`url(#${id}-lv)`} />
        <circle cx="194" cy="150" r="46" fill={`url(#${id}-lv)`} />
        <circle cx="150" cy="170" r="44" fill={`url(#${id}-lv2)`} />
        <circle cx="132" cy="148" r="34" fill={`url(#${id}-lv)`} />
      </g>
      <path d="M296 330C294 316 298 308 296 296" className="gm-trunk gm-thin" />
      <g filter={`url(#${id}-fluff)`}>
        <circle cx="296" cy="286" r="16" fill={`url(#${id}-lv)`} />
        <circle cx="284" cy="298" r="12" fill={`url(#${id}-lv)`} />
      </g>
      <circle cx="302" cy="290" r="4" className="gm-dot" />
      <Sparks art="tree" />
    </>
  );
}

export function GlimmerArt({ art = "moon", size = 240, className }: { art?: GlimmerName; size?: number; className?: string }) {
  const id = `gm-${art}`;
  return (
    <svg className={`gm-art${className ? ` ${className}` : ""}`} viewBox="0 0 400 400" width={size} height={size} aria-hidden focusable="false">
      <Defs id={id} />
      {art === "plant" && <Plant id={id} />}
      {art === "mushrooms" && <Mushrooms id={id} />}
      {art === "moon" && <Moon id={id} />}
      {art === "tree" && <Tree id={id} />}
    </svg>
  );
}
