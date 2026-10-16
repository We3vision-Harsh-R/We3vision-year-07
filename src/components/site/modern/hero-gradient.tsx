import type { CSSProperties } from "react";

// The background of the first screen of the inner pages (it replaces the leaves): soft light of the colours of the company theme. Every page has
// its own pattern (the shape of the light, the angle, where the three glows stand and which shades of the theme they use), so that no two pages
// look the same. The colours come from the theme (--th, --ts), so they follow the theme of the site. The look is in globals.css (.hg-*).

type Shape = "aurora" | "ring" | "cone" | "corner" | "horizon" | "sweep" | "diagonal" | "curtain";
/** x, y, width, height of a glow, in % of the first screen */
type Blob = [number, number, number, number];
type Pattern = {
  shape: Shape;
  /** the angle of the main light (deg) */
  ang: number;
  /** the shades: how far (in degrees of hue) each of the three lights is from the theme colour */
  hue: [number, number, number];
  blobs: [Blob, Blob, Blob];
  /** the centre of the ring (% of the screen) */
  ring?: [number, number];
  /** the shape is mirrored */
  flip?: boolean;
};

const PATTERNS: Record<string, Pattern> = {
  webdev: { shape: "aurora", ang: 120, hue: [0, 28, -20], blobs: [[76, 22, 60, 72], [16, 70, 50, 60], [58, 100, 70, 44]] },
  mobile: { shape: "ring", ang: 160, hue: [14, -16, 34], blobs: [[22, 28, 56, 70], [84, 64, 48, 64], [50, 100, 60, 40]], ring: [72, 34] },
  metaverse: { shape: "cone", ang: 200, hue: [-24, 18, 40], blobs: [[50, 6, 70, 50], [10, 62, 40, 70], [90, 70, 44, 70]] },
  "ui-ux-design": { shape: "corner", ang: 135, hue: [20, -10, 36], blobs: [[88, 14, 50, 60], [12, 84, 56, 60], [50, 50, 60, 56]] },
  crm: { shape: "horizon", ang: 180, hue: [-12, 24, 0], blobs: [[30, 94, 70, 50], [72, 88, 60, 48], [50, 6, 70, 40]] },
  animation: { shape: "sweep", ang: 40, hue: [30, -28, 10], blobs: [[84, 18, 52, 66], [20, 56, 46, 60], [64, 92, 64, 44]] },
  "3d-modeling": { shape: "diagonal", ang: 150, hue: [-30, 12, 34], blobs: [[14, 20, 54, 64], [86, 78, 56, 62], [50, 50, 50, 40]] },
  graphics: { shape: "curtain", ang: 90, hue: [10, -22, 38], blobs: [[30, 30, 46, 80], [70, 70, 46, 80], [50, 0, 70, 40]] },
  seo: { shape: "aurora", ang: 62, hue: [-16, 30, 6], blobs: [[22, 76, 62, 60], [82, 24, 52, 64], [50, 50, 56, 40]], flip: true },
  shopify: { shape: "ring", ang: 100, hue: [26, -8, -26], blobs: [[78, 30, 54, 66], [18, 78, 50, 60], [52, 4, 66, 40]], ring: [24, 62], flip: true },
  "custom-woocommerce": { shape: "cone", ang: 160, hue: [-6, 36, -26], blobs: [[50, 8, 64, 46], [88, 58, 44, 70], [12, 76, 44, 60]], flip: true },
  "shopify-app": { shape: "corner", ang: 45, hue: [32, 4, -24], blobs: [[10, 16, 54, 62], [90, 86, 54, 62], [56, 44, 50, 50]], flip: true },
  "wordpress-plugin": { shape: "horizon", ang: 0, hue: [-22, 8, 30], blobs: [[70, 96, 66, 50], [24, 90, 56, 46], [50, 8, 60, 36]], flip: true },
  "custom-wordpress": { shape: "diagonal", ang: 30, hue: [18, -26, 2], blobs: [[84, 16, 56, 64], [16, 80, 56, 62], [50, 50, 46, 40]], flip: true },
  "headless-cms": { shape: "curtain", ang: 60, hue: [-10, 26, 40], blobs: [[22, 40, 44, 80], [78, 60, 44, 80], [50, 100, 70, 40]], flip: true },
  portfolio: { shape: "sweep", ang: 210, hue: [4, 36, -30], blobs: [[16, 22, 54, 64], [80, 74, 54, 64], [50, 100, 60, 40]], flip: true },
};

/** a page that has no pattern of its own gets one from its address (the same one every time) */
function fallback(page: string): Pattern {
  let h = 0;
  for (const c of page) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const shapes: Shape[] = ["aurora", "ring", "cone", "corner", "horizon", "sweep", "diagonal", "curtain"];
  const a = (h % 7) * 9 - 28;
  return {
    shape: shapes[h % shapes.length],
    ang: 20 + (h % 300),
    hue: [a, (a + 40) % 60 - 30, ((h >> 3) % 70) - 30],
    blobs: [[20 + (h % 60), 18 + ((h >> 2) % 20), 56, 66], [10 + ((h >> 4) % 70), 70, 50, 60], [50, 96, 64, 42]],
    ring: [30 + (h % 40), 30 + ((h >> 5) % 30)],
    flip: h % 2 === 0,
  };
}

export function HeroGradient({ page }: { page: string }) {
  const p = PATTERNS[page] ?? fallback(page);
  const style = {
    "--ang": `${p.ang}deg`,
    "--ha": p.hue[0],
    "--hb": p.hue[1],
    "--hc": p.hue[2],
    "--rx": `${p.ring?.[0] ?? 70}%`,
    "--ry": `${p.ring?.[1] ?? 34}%`,
  } as CSSProperties;
  return (
    <div className="hg" data-shape={p.shape} data-flip={p.flip ? "1" : "0"} style={style} aria-hidden>
      {p.blobs.map(([x, y, w, h], i) => (
        <i key={i} style={{ "--x": `${x}%`, "--y": `${y}%`, "--w": `${w}%`, "--h": `${h}%` } as CSSProperties} />
      ))}
    </div>
  );
}
