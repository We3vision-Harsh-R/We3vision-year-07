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

// The wall boards of the four metaverse teams (the cabins of the metaverse floor, see metaverse/vr-floor.tsx).
/** AR: a phone that looks at a table, a cube floats above it */
function Ar() {
  return (
    <Frame>
      <rect x="12" y="15" width="40" height="58" rx="6" className="bd-card" />
      <rect x="16" y="20" width="32" height="40" rx="3" className="bd-block bd-blink" />
      <circle cx="32" cy="66" r="2.4" className="bd-sw bd-sw-2 bd-pulse" />
      <path d="M52 36l22 -6M52 50l22 6" className="bd-flow" />
      <g className="bd-float">
        <path d="M100 18l16 9v18l-16 9-16-9V27z" className="bd-cube-a" />
        <path d="M100 18l16 9-16 9-16-9z" className="bd-cube-b" />
        <path d="M100 36l16-9v18l-16 9z" className="bd-cube-c" />
      </g>
      <rect x="76" y="62" width="54" height="6" rx="3" className="bd-block" />
    </Frame>
  );
}
/** VR: a headset and a world that turns round it */
function Vr() {
  return (
    <Frame>
      <rect x="22" y="26" width="52" height="28" rx="12" className="bd-card" />
      <rect x="29" y="33" width="38" height="14" rx="6" className="bd-block bd-blink" />
      <path d="M22 40q-10 0-10 8M74 40q10 0 10 8" className="bd-line" />
      <circle cx="112" cy="40" r="22" className="bd-card" />
      <ellipse cx="112" cy="40" rx="22" ry="8" className="bd-ring" />
      <ellipse cx="112" cy="40" rx="8" ry="22" className="bd-ring bd-d1" />
      <circle cx="30" cy="64" r="1.6" className="bd-star" />
      <circle cx="132" cy="14" r="1.4" className="bd-star bd-d1" />
    </Frame>
  );
}
/** XR: three devices that share one scene */
function Xr() {
  const L = [[24, 24], [24, 54], [75, 39], [126, 24], [126, 54]];
  return (
    <Frame>
      {[[0, 2], [1, 2], [2, 3], [2, 4]].map(([a, b], i) => (
        <path key={i} d={`M${L[a][0]} ${L[a][1]}L${L[b][0]} ${L[b][1]}`} className="bd-flow" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      {L.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 8 : 5} className={i === 2 ? "bd-sw bd-sw-1 bd-pulse" : "bd-node"} />
      ))}
      <path d="M62 66h26" className="bd-line" />
    </Frame>
  );
}
/** MR: a real room with a virtual cube standing in it */
function Mr() {
  return (
    <Frame>
      <rect x="12" y="16" width="126" height="52" rx="5" className="bd-card" />
      <path d="M12 52h126" className="bd-line" />
      <rect x="22" y="26" width="30" height="22" rx="2" className="bd-block" />
      <rect x="100" y="30" width="26" height="18" rx="2" className="bd-block bd-blink" />
      <g className="bd-float">
        <path d="M75 24l14 8v16l-14 8-14-8V32z" className="bd-cube-a" />
        <path d="M75 24l14 8-14 8-14-8z" className="bd-cube-b" />
        <path d="M75 40l14-8v16l-14 8z" className="bd-cube-c" />
      </g>
      <ellipse cx="75" cy="60" rx="20" ry="4" className="bd-ring" />
    </Frame>
  );
}
export const METAVERSE_BOARDS = [Ar, Vr, Xr, Mr];
