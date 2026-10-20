import "server-only";
import { ImageResponse } from "next/og";
import { TILES, tileOf } from "@/lib/blog-shared";
import { db } from "@/lib/db";

// A cover picture DRAWN BY CODE for an article that came without a picture (no stock photo, no paid image service: the project rule is that art
// is drawn with code). It is the shape the Blog page wants (landscape, square, portrait or tall), in the dark violet of the brand, with soft
// glows, rings and a dot grid whose arrangement comes from the title (so every article gets its own cover), the topic label at the top and the
// title at the bottom, because on the Blog page the cover is all that is seen. Made with next/og (Satori), which ships with Next.js.
// A picture cannot follow the visitor's colour theme, so it uses the default violet hues of the site (like public/brand/og-image.png).

export type CoverInput = { title: string; category?: string; tile?: string };
export type CoverResult = { ok: true; url: string; mime: "image/png"; size: number; bytes: Uint8Array<ArrayBuffer>; width: number; height: number } | { ok: false; error: string };

/** "1200 × 864 px" -> { w: 1200, h: 864 } (the sizes the admin form tells the editor to upload) */
export function coverSize(tile: unknown): { w: number; h: number } {
  const t = TILES.find((x) => x.value === tileOf(tile)) ?? TILES[2];
  const m = /(\d+)\s*×\s*(\d+)/.exec(t.size);
  return m ? { w: Number(m[1]), h: Number(m[2]) } : { w: 900, h: 1200 };
}

function seeded(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hsl(h: number, s: number, l: number, a = 1) {
  const S = s / 100;
  const L = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) => L - S * Math.min(L, 1 - L) * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `rgba(${Math.round(255 * f(0))},${Math.round(255 * f(8))},${Math.round(255 * f(4))},${a})`;
}

// hues next to the brand violet (284): the cover of each article leans a little towards one of them
const HUES = [284, 266, 304, 250, 322];

/** Draws the cover. Pure: the same title gives the same picture. */
export async function drawCover(input: CoverInput): Promise<{ bytes: Uint8Array<ArrayBuffer>; width: number; height: number }> {
  const { w, h } = coverSize(input.tile);
  const title = input.title.replace(/\s+/g, " ").trim().slice(0, 110) || "We3vision";
  const category = (input.category ?? "").trim().slice(0, 28);
  const rnd = seeded(`${title}|${category}`);
  const hue = HUES[Math.floor(rnd() * HUES.length)];
  const unit = Math.min(w, h);

  // big soft glows: layers of the background of the whole picture (a glow in a box of its own would show the edge of the box)
  const glows = Array.from({ length: 3 }, (_, i) => `radial-gradient(circle at ${Math.round(rnd() * 100)}% ${Math.round(rnd() * 100)}%, ${hsl(hue + (i - 1) * 26, 78, 52, 0.28 + rnd() * 0.22)} 0%, ${hsl(hue + (i - 1) * 26, 78, 52, 0)} ${28 + Math.round(rnd() * 20)}%)`);
  // rings
  const rings = Array.from({ length: 4 }, () => {
    const size = unit * (0.35 + rnd() * 0.75);
    return { left: rnd() * w - size / 2, top: rnd() * h * 0.75 - size / 4, size, a: 0.1 + rnd() * 0.14 };
  });
  // dot grid in one corner
  const cols = 8;
  const gap = unit * 0.045;
  const gx = rnd() > 0.5 ? w - gap * (cols + 1) - unit * 0.05 : unit * 0.05;
  const gy = h * (0.2 + rnd() * 0.25);
  const dots = Array.from({ length: cols * 5 }, (_, i) => ({ x: gx + (i % cols) * gap, y: gy + Math.floor(i / cols) * gap }));

  const pad = Math.round(unit * 0.075);
  const len = title.length;
  const titleSize = Math.round(unit * (len <= 36 ? 0.088 : len <= 64 ? 0.072 : 0.06));
  const small = Math.round(unit * 0.03);

  const res = new ImageResponse(
    (
      <div style={{ width: w, height: h, display: "flex", position: "relative", overflow: "hidden", backgroundImage: `${glows.join(",")}, linear-gradient(160deg, ${hsl(hue - 6, 62, 20)} 0%, ${hsl(hue, 76, 7)} 62%, ${hsl(hue + 12, 80, 4)} 100%)` }}>
        {rings.map((r, i) => (
          <div key={`r${i}`} style={{ position: "absolute", left: r.left, top: r.top, width: r.size, height: r.size, borderRadius: "50%", border: `${Math.max(2, Math.round(unit * 0.004))}px solid ${hsl(hue + 14, 100, 78, r.a)}` }} />
        ))}
        {dots.map((d, i) => (
          <div key={`d${i}`} style={{ position: "absolute", left: d.x, top: d.y, width: Math.round(unit * 0.008), height: Math.round(unit * 0.008), borderRadius: "50%", background: hsl(hue + 14, 100, 84, 0.45) }} />
        ))}
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, display: "flex", border: `2px solid ${hsl(hue + 14, 100, 78, 0.18)}` }} />

        <div style={{ position: "absolute", left: pad, top: pad, right: pad, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {category ? (
            <div style={{ display: "flex", padding: `${Math.round(small * 0.45)}px ${Math.round(small * 0.9)}px`, borderRadius: 999, border: `2px solid ${hsl(hue + 14, 100, 80, 0.55)}`, background: hsl(hue, 70, 30, 0.35), color: hsl(hue + 14, 100, 90), fontSize: small, letterSpacing: 2, textTransform: "uppercase" }}>
              {category}
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}
          <div style={{ display: "flex", color: hsl(hue + 14, 100, 84, 0.9), fontSize: Math.round(small * 1.1), letterSpacing: 1 }}>We3vision</div>
        </div>

        <div style={{ position: "absolute", left: pad, right: pad, bottom: pad, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: Math.round(unit * 0.12), height: Math.max(4, Math.round(unit * 0.008)), borderRadius: 4, background: hsl(hue + 14, 100, 78), marginBottom: Math.round(unit * 0.04) }} />
          <div style={{ display: "flex", color: "#ffffff", fontSize: titleSize, lineHeight: 1.12, letterSpacing: -1, maxHeight: titleSize * 1.12 * 6, overflow: "hidden" }}>{title}</div>
        </div>
      </div>
    ),
    { width: w, height: h },
  );
  return { bytes: new Uint8Array(await res.arrayBuffer()), width: w, height: h };
}

/** Draws the cover and keeps it in the media library (the same table as every uploaded picture). */
export async function createCover(input: CoverInput): Promise<CoverResult> {
  try {
    const { bytes, width, height } = await drawCover(input);
    const name = `ai-cover-${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)}.png`;
    const row = await db.media.create({ data: { name, mime: "image/png", size: bytes.length, data: bytes }, select: { id: true } });
    return { ok: true, url: `/media/${row.id}`, mime: "image/png", size: bytes.length, bytes, width, height };
  } catch (error) {
    console.error("createCover failed", error);
    return { ok: false, error: "The cover picture could not be drawn." };
  }
}
