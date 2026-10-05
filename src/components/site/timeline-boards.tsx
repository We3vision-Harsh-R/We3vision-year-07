// The wall boards of the seven departments in the office of the last year (timeline-office.tsx): a small illustrated panel each,
// with a little animation (a logo being drawn, a page being built, a tap on a phone, a network that works, a spinning 3D cube,
// sticky notes that move, a card that travels through a pipeline). Colours are theme colours (classes .bd-*, see globals.css).

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 150 78" className="bd" fill="none" aria-hidden>
      <rect x="1" y="1" width="148" height="76" rx="7" className="bd-panel" />
      <rect x="1" y="1" width="148" height="9" rx="7" className="bd-top" />
      <circle cx="9" cy="5.5" r="1.4" className="bd-dot" />
      <circle cx="14.5" cy="5.5" r="1.4" className="bd-dot" />
      <circle cx="20" cy="5.5" r="1.4" className="bd-dot" />
      {children}
    </svg>
  );
}

/** 0 brand design: colour swatches and a logo that is drawn again and again */
function Brand() {
  return (
    <Frame>
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={16 + i * 13} cy="66" r="4.6" className={`bd-sw bd-sw-${i}`} />
      ))}
      <rect x="10" y="17" width="58" height="40" rx="5" className="bd-card" />
      <path className="bd-draw" d="M20 28l7 20 8-13 8 13 7-20" />
      <path d="M78 22h58M78 30h46M78 38h52M78 46h34" className="bd-line" />
      <circle cx="122" cy="62" r="7" className="bd-sw bd-sw-1" />
      <path className="bd-draw bd-draw-b" d="M116 62h12M122 56v12" />
    </Frame>
  );
}
/** 1 web development: a page with a header, blocks and lines of code that flicker */
function Web() {
  return (
    <Frame>
      <rect x="9" y="15" width="70" height="55" rx="4" className="bd-card" />
      <rect x="13" y="19" width="62" height="8" rx="2" className="bd-block" />
      <rect x="13" y="31" width="29" height="18" rx="2" className="bd-block bd-blink" />
      <rect x="46" y="31" width="29" height="18" rx="2" className="bd-block bd-blink bd-d1" />
      <rect x="13" y="53" width="62" height="12" rx="2" className="bd-block bd-blink bd-d2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M88 ${20 + i * 10}h${[40, 52, 30, 46, 36][i]}`} className={`bd-code bd-blink bd-d${i % 3}`} />
      ))}
    </Frame>
  );
}
/** 2 mobile apps: two phones and a tap */
function Mobile() {
  return (
    <Frame>
      {[22, 86].map((x, i) => (
        <g key={x}>
          <rect x={x} y="14" width="36" height="58" rx="6" className="bd-card" />
          <rect x={x + 4} y="19" width="28" height="7" rx="2" className="bd-block" />
          <rect x={x + 4} y="30" width="28" height="9" rx="2" className="bd-block bd-blink" />
          <rect x={x + 4} y="42" width="28" height="9" rx="2" className="bd-block bd-blink bd-d1" />
          <rect x={x + 8} y="58" width="20" height="8" rx="4" className="bd-sw bd-sw-2" />
          {i === 0 && <circle cx={x + 18} cy="62" r="3" className="bd-tap" />}
        </g>
      ))}
      <path d="M62 43h20m-6-5l6 5-6 5" className="bd-arrow" />
    </Frame>
  );
}
/** 3 AI: a small neural network with signals running through it */
function Ai() {
  const L = [
    [24, 22], [24, 39], [24, 56],
    [64, 16], [64, 31], [64, 46], [64, 61],
    [104, 28], [104, 49],
    [134, 39],
  ];
  const E: [number, number][] = [[0, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6], [3, 7], [4, 7], [4, 8], [5, 8], [6, 8], [7, 9], [8, 9]];
  return (
    <Frame>
      {E.map(([a, b], i) => (
        <path key={i} d={`M${L[a][0]} ${L[a][1]}L${L[b][0]} ${L[b][1]}`} className="bd-flow" style={{ animationDelay: `${(i % 5) * 0.25}s` }} />
      ))}
      {L.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 9 ? 6 : 4.4} className={i === 9 ? "bd-sw bd-sw-1 bd-pulse" : "bd-node"} />
      ))}
    </Frame>
  );
}
/** 4 metaverse: a cube with a ring that goes round it */
function Meta() {
  return (
    <Frame>
      <g className="bd-float">
        <path d="M75 20l20 11v22L75 64 55 53V31z" className="bd-cube-a" />
        <path d="M75 20l20 11-20 11-20-11z" className="bd-cube-b" />
        <path d="M75 42l20-11v22L75 64z" className="bd-cube-c" />
      </g>
      <ellipse cx="75" cy="42" rx="42" ry="10" className="bd-ring" />
      <circle cx="30" cy="22" r="1.6" className="bd-star" />
      <circle cx="122" cy="26" r="1.2" className="bd-star bd-d1" />
      <circle cx="116" cy="60" r="1.6" className="bd-star bd-d2" />
      <circle cx="34" cy="60" r="1.2" className="bd-star bd-d1" />
    </Frame>
  );
}
/** 5 UI/UX: a wall of sticky notes, one of them is moved around */
function Ux() {
  const tones = [0, 1, 2, 3, 1, 2, 0, 3, 2, 1, 3, 0];
  return (
    <Frame>
      {tones.map((t, i) => (
        <rect key={i} x={12 + (i % 6) * 22} y={17 + Math.floor(i / 6) * 21} width="17" height="16" rx="2.5" className={`bd-sw bd-sw-${t}`} opacity={i === 7 ? 0 : 0.92} />
      ))}
      <rect x="12" y="17" width="17" height="16" rx="2.5" className="bd-sw bd-sw-1 bd-note" />
      <path d="M12 56h126M12 62h96" className="bd-line" />
    </Frame>
  );
}
/** 6 CRM: three columns of a sales pipeline and a card that travels through it */
function Crm() {
  return (
    <Frame>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={10 + i * 47} y="15" width="42" height="56" rx="4" className="bd-card" />
          <rect x={14 + i * 47} y="19" width="22" height="3.6" rx="1.8" className="bd-line-f" />
          <rect x={14 + i * 47} y="26" width="34" height="9" rx="2" className="bd-block" />
          <rect x={14 + i * 47} y="38" width="34" height="9" rx="2" className="bd-block bd-blink bd-d1" />
        </g>
      ))}
      <rect x="14" y="50" width="34" height="9" rx="2" className="bd-sw bd-sw-2 bd-travel" />
    </Frame>
  );
}

export const BOARDS = [Brand, Web, Mobile, Ai, Meta, Ux, Crm];
