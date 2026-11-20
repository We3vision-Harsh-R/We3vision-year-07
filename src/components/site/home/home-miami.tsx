// GTA theme (task 159): a Miami night skyline along the bottom of the footer, drawn here as SVG (own drawing, no image files): far towers, art-deco hotels
// with stepped and round tops, lit windows (two patterns), neon bands and signs, palm trees at both edges and a strip of ocean with the lights reflected in
// it. Server component: the buildings come from a small seeded generator, so the server and the browser always draw the same city. Styles: home-footer-glow.css
// (prefix fc-, colours = the theme hue plus an offset). The sun behind it is the ::before of the footer. aria-hidden, no pointer events.
const W = 1920;
const H = 190;
const G = 158; // the ground line: buildings stand on it, the ocean starts under it

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const n1 = (v: number) => v.toFixed(1);

type Kind = "tower" | "step" | "round" | "deco";
type Mid = { x: number; w: number; h: number; kind: Kind; hue: 1 | 2 };

function city() {
  const r = rng(11);
  const pick = (a: number, b: number) => a + (b - a) * r();
  // the far towers: plain dark shapes
  let far = "";
  for (let x = -10; x < W; ) {
    const w = pick(30, 76);
    const h = pick(40, 112);
    far += `M${n1(x)} ${G}V${n1(G - h)}h${n1(w)}V${G}Z`;
    x += w + pick(0, 7);
  }
  // the hotels and towers in front
  const kinds: Kind[] = ["deco", "step", "round", "tower", "deco", "step"];
  const mids: Mid[] = [];
  for (let x = 24; x < W - 70; ) {
    const w = pick(54, 102);
    const h = pick(64, 138);
    mids.push({ x, w, h, kind: kinds[Math.floor(r() * kinds.length)], hue: r() < 0.5 ? 1 : 2 });
    x += w + pick(6, 24);
  }
  return { far, mids };
}

function body(b: Mid) {
  const { x, w, h } = b;
  const top = G - h;
  if (b.kind === "round") return `M${n1(x)} ${G}V${n1(top + w / 2)}A${n1(w / 2)} ${n1(w / 2)} 0 0 1 ${n1(x + w)} ${n1(top + w / 2)}V${G}Z`;
  if (b.kind === "step") return `M${n1(x)} ${G}V${n1(G - h * 0.7)}H${n1(x + w * 0.16)}V${n1(top)}H${n1(x + w * 0.84)}V${n1(G - h * 0.7)}H${n1(x + w)}V${G}Z`;
  if (b.kind === "deco") return `M${n1(x)} ${G}V${n1(top + 12)}L${n1(x + 12)} ${n1(top)}H${n1(x + w - 12)}L${n1(x + w)} ${n1(top + 12)}V${G}Z`;
  return `M${n1(x)} ${G}V${n1(top)}H${n1(x + w)}V${G}Z`;
}

const FROND = "M0 0C20 -26 62 -24 94 18C60 -2 24 -4 0 0Z";
function Palm({ x, h, lean, s = 1 }: { x: number; h: number; lean: number; s?: number }) {
  const top = 230 - h;
  const cx = x + lean;
  return (
    <g>
      <path className="fc-trunk" d={`M${x} 230Q${n1(x + lean * 0.15)} ${n1(230 - h * 0.55)} ${n1(cx)} ${n1(top)}`} />
      <g transform={`translate(${n1(cx)} ${n1(top)}) scale(${s})`}>
        {[-78, -48, -16, 14].map((a) => (
          <g key={a}>
            <path className="fc-frond" d={FROND} transform={`rotate(${a})`} />
            <path className="fc-frond" d={FROND} transform={`scale(-1 1) rotate(${a})`} />
          </g>
        ))}
        <circle className="fc-frond" r="5" cy="3" />
      </g>
    </g>
  );
}

export function HomeMiami() {
  const { far, mids } = city();
  return (
    <>
      <svg className="fc-city" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden focusable="false">
        <defs>
          {/* windows: two grids of small lit panes, laid over the hotels */}
          <pattern id="fc-w1" width="11" height="13" patternUnits="userSpaceOnUse">
            <rect className="fc-lit1" x="2" y="3" width="4" height="5" rx="1" />
          </pattern>
          <pattern id="fc-w2" width="14" height="11" patternUnits="userSpaceOnUse" patternTransform="translate(3 2)">
            <rect className="fc-lit2" x="3" y="2" width="5" height="4" rx="1" />
          </pattern>
          <linearGradient id="fc-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="fc-sea-a" />
            <stop offset="1" className="fc-sea-b" />
          </linearGradient>
        </defs>
        <path className="fc-far" d={far} />
        {mids.map((b, i) => {
          const top = G - b.h;
          const wy = b.kind === "round" ? top + b.w / 2 + 8 : b.kind === "step" ? G - b.h * 0.7 + 8 : top + 18;
          return (
            <g key={i}>
              <path className="fc-mid" d={body(b)} />
              <rect x={b.x + 6} y={wy} width={b.w - 12} height={G - wy - 4} fill={`url(#fc-w${b.hue})`} className="fc-win" />
              {b.kind === "deco" && (
                <g className="fc-neon">
                  <rect className="fc-halo" x={b.x + 2} y={G - b.h * 0.55 - 4} width={b.w - 4} height="10" />
                  <rect x={b.x + 2} y={G - b.h * 0.55} width={b.w - 4} height="3" />
                </g>
              )}
              {b.kind === "step" && (
                <g className="fc-neon">
                  <rect className="fc-halo" x={b.x + b.w * 0.16} y={top - 4} width={b.w * 0.68} height="9" />
                  <rect x={b.x + b.w * 0.16} y={top - 1} width={b.w * 0.68} height="3" />
                </g>
              )}
              {b.kind === "tower" && i % 3 === 0 && (
                <g className="fc-neon">
                  <rect x={b.x + b.w / 2 - 1} y={top - 20} width="2" height="20" />
                  <circle cx={b.x + b.w / 2} cy={top - 22} r="3" />
                </g>
              )}
              {b.kind === "round" && (
                <g className="fc-neon">
                  <rect className="fc-halo" x={b.x + b.w - 11} y={top + b.w / 2} width="10" height={Math.min(46, b.h - b.w / 2 - 10)} />
                  <rect x={b.x + b.w - 8} y={top + b.w / 2 + 2} width="4" height={Math.min(42, b.h - b.w / 2 - 14)} />
                </g>
              )}
              {/* the reflection of the building in the ocean */}
              <rect className="fc-refl" x={b.x + 6} y={G + 4} width={b.w - 12} height={6 + (i % 4) * 5} />
            </g>
          );
        })}
        <rect className="fc-sea" x="0" y={G} width={W} height={H - G} fill="url(#fc-sea)" />
        <rect className="fc-shore" x="0" y={G} width={W} height="2" />
        {[168, 174, 180, 185].map((y, i) => (
          <rect key={y} className="fc-wave" x={120 + i * 140} y={y} width={620 - i * 60} height="1.5" />
        ))}
        {[168, 174, 180, 185].map((y, i) => (
          <rect key={`b${y}`} className="fc-wave" x={1000 + i * 90} y={y} width={560 - i * 50} height="1.5" />
        ))}
      </svg>
      <svg className="fc-palms fc-palms-l" viewBox="0 0 270 230" aria-hidden focusable="false">
        <Palm x={58} h={178} lean={26} />
        <Palm x={150} h={128} lean={14} s={0.8} />
        <Palm x={222} h={92} lean={8} s={0.62} />
      </svg>
      <svg className="fc-palms fc-palms-r" viewBox="0 0 270 230" aria-hidden focusable="false">
        <Palm x={58} h={166} lean={24} />
        <Palm x={152} h={120} lean={12} s={0.78} />
        <Palm x={226} h={88} lean={6} s={0.6} />
      </svg>
    </>
  );
}
