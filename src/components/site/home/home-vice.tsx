// GTA theme (task 161, changed in task 164): the background of the two empty cells at the bottom left of the products grid ("Our products built in-house"):
// a purple-to-plum gradient with a soft city skyline (translucent towers with fine window lines) and two clusters of palm trees, like the reference banner the
// owner sent. Only a background: the snow, the snowballs and the snowman of the winter layer stand on top of it, as before. Own drawing in SVG, theme colours
// only (styles/gta-vice.css, prefix vc-), laptop and desktop only, decorative (aria-hidden). Placed by the grid: columns 1-2 of row 4 (next to WePte).
// The towers come from a small seeded generator, so the server and the browser draw the same city.
const W = 800;
const H = 232;
const FROND = "M0 0C20 -26 62 -24 94 18C60 -2 24 -4 0 0Z";

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

// one row of towers standing on the bottom edge: x from `from` to `to`, the height follows a soft hill around `peak` (the middle of the city is the tallest)
function towers(seed: number, from: number, to: number, wMin: number, wMax: number, hMin: number, hMax: number, peak: number, spread: number, lift: number) {
  const r = rng(seed);
  const pick = (a: number, b: number) => a + (b - a) * r();
  let d = "";
  for (let x = from; x < to; ) {
    const w = pick(wMin, wMax);
    const hill = Math.exp(-(((x - peak) / spread) ** 2));
    const h = Math.min(hMax, pick(hMin, hMin + (hMax - hMin) * 0.5) + lift * hill);
    d += `M${n1(x)} ${H}V${n1(H - h)}h${n1(w)}V${H}Z`;
    x += w + pick(0, 4);
  }
  return d;
}

function Palm({ x, top, lean, s }: { x: number; top: number; lean: number; s: number }) {
  const cx = x + lean;
  return (
    <g>
      <path className="vc-trunk" d={`M${x} ${H + 4}Q${n1(x + lean * 0.2)} ${n1((H + top) / 2 + 12)} ${n1(cx)} ${top}`} />
      <g transform={`translate(${n1(cx)} ${top}) scale(${s})`}>
        {[-80, -50, -18, 14].map((a) => (
          <g key={a}>
            <path className="vc-palm" d={FROND} transform={`rotate(${a})`} />
            <path className="vc-palm" d={FROND} transform={`scale(-1 1) rotate(${a})`} />
          </g>
        ))}
        <circle className="vc-palm" r="5" cy="3" />
      </g>
    </g>
  );
}

export function HomeVice() {
  const back = towers(5, 90, 760, 10, 30, 36, 120, 470, 150, 40);
  const mid = towers(9, 200, 660, 14, 38, 60, 168, 440, 120, 80);
  return (
    <div className="vc" data-r aria-hidden style={{ gridColumn: "1 / span 2", gridRow: 4 }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="vc-sky" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" className="vc-sky-a" />
            <stop offset="1" className="vc-sky-b" />
          </linearGradient>
          <linearGradient id="vc-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="vc-haze-a" />
            <stop offset="1" className="vc-haze-b" />
          </linearGradient>
          {/* the fine window lines of the towers */}
          <pattern id="vc-lines" width="5" height="9" patternUnits="userSpaceOnUse">
            <rect className="vc-line" x="1.5" y="0" width="1.2" height="9" />
          </pattern>
          <clipPath id="vc-cut">
            <path d={mid} />
          </clipPath>
        </defs>
        <rect width={W} height={H} fill="url(#vc-sky)" />
        <rect width={W} height={H} fill="url(#vc-haze)" />
        <path className="vc-back" d={back} />
        <path className="vc-mid" d={mid} />
        <rect width={W} height={H} fill="url(#vc-lines)" clipPath="url(#vc-cut)" />
        <Palm x={236} top={112} lean={14} s={0.78} />
        <Palm x={282} top={146} lean={-6} s={0.56} />
        <Palm x={574} top={104} lean={-12} s={0.82} />
        <Palm x={622} top={142} lean={8} s={0.58} />
      </svg>
    </div>
  );
}
