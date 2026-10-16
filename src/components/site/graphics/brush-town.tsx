"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { THEME_EVENT, liveTheme } from "@/lib/theme";

// A painted town for the industries of the Graphic Design page. It is painted with p5.brush (https://github.com/acamposuribe/p5.brush, MIT), the
// open-source brush library for p5.js: watercolour fills, pencil and ink strokes, hatching and a hand-made wobble. Every industry is a little house
// of the town (a hospital, a school, a crane, a shop...). The town is painted once on a canvas (and again when the visitor changes the colour theme);
// the houses are buttons laid over the painting, so they work with the keyboard and screen readers too.

export const TOWN_W = 1200;
export const TOWN_H = 560;
const BASE = 160; // y of the ground line of the houses (the canvas is centred: -280 ... 280)

export type Kind = "health" | "school" | "build" | "shop" | "game" | "ads" | "office" | "home";
const CYCLE: Kind[] = ["home", "office", "shop", "school", "build", "ads", "health", "game"];
export function kindOf(name: string, i: number): Kind {
  const n = name.toLowerCase();
  if (/health|medic|hospital|care|pharma/.test(n)) return "health";
  if (/educ|school|learn|train/.test(n)) return "school";
  if (/construct|architect|real estate|property/.test(n)) return "build";
  if (/commerce|retail|shop|store|fashion|food/.test(n)) return "shop";
  if (/gam/.test(n)) return "game";
  if (/market|advert|media|event/.test(n)) return "ads";
  if (/corporate|business|b2b|financ|bank|software|tech/.test(n)) return "office";
  return CYCLE[i % CYCLE.length];
}

/** where the house of slot i stands (x of its centre on the canvas, from -W/2) */
export const slotX = (i: number, n: number) => {
  const span = TOWN_W - 230;
  return n <= 1 ? 0 : -span / 2 + (span / (n - 1)) * i;
};

function hsl(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const x = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${x(f(0))}${x(f(8))}${x(f(4))}`;
}

export type Layer = "ink" | "color";

// The town is painted twice: once with only the pen (ink: outlines, hatching, details) and once with only the paint (colour washes and fills). The page
// stacks the two canvases on a white artboard and reveals them with the scroll: first the drawing, then the colour flowing in.
function paintTown(p: any, brush: any, theme: { h: number; s: number }, kinds: Kind[], layer: Layer) {
  const INK = layer === "ink";
  // a shape is only drawn in the layer where it has something to draw (the pen layer has no washes, the colour layer has no lines)
  let on = true;
  const g = (name: string) => (...a: unknown[]) => (on ? brush[name](...a) : undefined);
  const B = { rect: g("rect"), circle: g("circle"), line: g("line"), spline: g("spline"), beginShape: g("beginShape"), vertex: g("vertex"), endShape: g("endShape") };
  const S = theme.s;
  const hb = theme.h + 354; // the accent of the site (violet by default)
  const col = (o: number, sat: number, l: number) => hsl(hb + o, sat * S, l);
  const ink = col(0, 45, 20);

  p.randomSeed(21);
  p.noiseSeed(21);
  if (INK) p.clear();
  else p.background("#ffffff"); // the watercolour needs an opaque ground to blend with
  brush.wiggle(1.6);
  brush.set("2B", ink, 1); // a brush must be set once before anything is drawn, even in the colour layer

  const wash = (color: string, op = 120, bleed = 0.4, tex = 0.5) => {
    on = !INK;
    brush.noStroke();
    brush.noHatch();
    if (INK) {
      brush.noFill();
      return;
    }
    brush.fill(color, op);
    brush.fillBleed(bleed);
    brush.fillTexture(tex, 0.55);
  };
  const line = (w = 1) => {
    on = INK;
    brush.noFill();
    brush.noHatch();
    if (!INK) {
      brush.noStroke();
      return;
    }
    brush.set("2B", ink, w);
  };
  const solid = (fill: string, op = 150, w = 1) => {
    on = true;
    brush.noHatch();
    if (INK) {
      brush.set("2B", ink, w);
      brush.noFill();
      return;
    }
    brush.noStroke();
    brush.fill(fill, op);
    brush.fillBleed(0.3);
    brush.fillTexture(0.5, 0.5);
  };
  const shade = (color: string, dist = 6, angle = 40) => {
    on = INK;
    brush.noFill();
    brush.noStroke();
    if (!INK) {
      brush.noHatch();
      return;
    }
    brush.hatch(dist, angle, { rand: 0.08 });
    brush.hatchStyle("HB", color, 0.45);
  };
  const noHatch = () => brush.noHatch();

  // ---- sky, sun, clouds, far hills -------------------------------------------------------------------------------------------------------
  wash(col(300, 75, 86), 90, 0.55, 0.4);
  B.rect(-590, -270, 1180, 250);
  wash(col(330, 70, 88), 80, 0.6, 0.4);
  B.rect(-590, -200, 1180, 160);
  wash(col(127, 95, 72), 190, 0.3, 0.5);
  B.circle(-430, -150, 46);
  line(0.6);
  brush.noFill();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    B.line(-430 + Math.cos(a) * 64, -150 + Math.sin(a) * 64, -430 + Math.cos(a) * 84, -150 + Math.sin(a) * 84);
  }
  for (const [cx, cy, s] of [[-120, -190, 1], [260, -215, 1.25], [470, -150, 0.8]] as const) {
    wash(col(0, 25, 99), 235, 0.5, 0.3);
    B.circle(cx, cy, 24 * s);
    B.circle(cx + 30 * s, cy + 6, 30 * s);
    B.circle(cx + 62 * s, cy + 8, 22 * s);
  }
  wash(col(212, 40, 76), 110, 0.5, 0.5);
  B.beginShape();
  B.vertex(-600, -20);
  B.vertex(-480, -80);
  B.vertex(-330, -30);
  B.vertex(-150, -105);
  B.vertex(60, -40);
  B.vertex(250, -95);
  B.vertex(430, -30);
  B.vertex(600, -70);
  B.vertex(600, 60);
  B.vertex(-600, 60);
  B.endShape(p.CLOSE);
  wash(col(212, 48, 66), 120, 0.5, 0.5);
  B.beginShape();
  B.vertex(-600, 30);
  B.vertex(-380, -20);
  B.vertex(-200, 40);
  B.vertex(10, -15);
  B.vertex(230, 45);
  B.vertex(430, -5);
  B.vertex(600, 35);
  B.vertex(600, 110);
  B.vertex(-600, 110);
  B.endShape(p.CLOSE);

  // ---- ground and the path ---------------------------------------------------------------------------------------------------------------
  wash(col(212, 40, 82), 130, 0.45, 0.45);
  B.rect(-600, BASE - 25, 1200, 190);
  shade(col(212, 45, 55), 9, 20);
  B.rect(-590, BASE + 10, 1180, 110);
  wash(col(127, 30, 90), 170, 0.4, 0.4);
  B.beginShape();
  B.vertex(-600, BASE + 40);
  B.vertex(-300, BASE + 25);
  B.vertex(0, BASE + 48);
  B.vertex(300, BASE + 26);
  B.vertex(600, BASE + 42);
  B.vertex(600, BASE + 80);
  B.vertex(300, BASE + 64);
  B.vertex(0, BASE + 88);
  B.vertex(-300, BASE + 62);
  B.vertex(-600, BASE + 84);
  B.endShape(p.CLOSE);

  // ---- trees (between the houses) --------------------------------------------------------------------------------------------------------
  const n = kinds.length;
  const tree = (x: number, s: number) => {
    line(1.2);
    B.line(x, BASE + 6, x, BASE - 40 * s);
    wash(col(212 + 20, 55, 62), 165, 0.45, 0.5);
    B.circle(x, BASE - 62 * s, 26 * s);
    B.circle(x - 16 * s, BASE - 48 * s, 18 * s);
    B.circle(x + 16 * s, BASE - 50 * s, 18 * s);
  };
  for (let i = 0; i < n - 1; i++) tree((slotX(i, n) + slotX(i + 1, n)) / 2, 0.9 + (i % 3) * 0.12);
  tree(-575, 1.1);
  tree(575, 1.1);

  // ---- the houses ------------------------------------------------------------------------------------------------------------------------
  const win = (x: number, y: number, w: number, h: number, c: string) => {
    solid(c, 210, 0.7);
    B.rect(x, y, w, h);
  };
  const house = (kind: Kind, cx: number) => {
    const b = BASE;
    if (kind === "health") {
      solid(col(0, 20, 97), 200, 1.3);
      B.rect(cx - 62, b - 150, 124, 150);
      shade(col(212, 40, 70), 7, 50);
      B.rect(cx - 62, b - 150, 124, 150);
      noHatch();
      wash(col(72, 85, 66), 220, 0.3, 0.4);
      B.rect(cx - 8, b - 128, 16, 52);
      B.rect(cx - 26, b - 110, 52, 16);
      win(cx - 50, b - 56, 26, 30, col(300, 70, 82));
      win(cx + 24, b - 56, 26, 30, col(300, 70, 82));
      solid(col(0, 30, 90), 230, 1);
      B.rect(cx - 13, b - 50, 26, 50);
    } else if (kind === "school") {
      solid(col(127, 60, 80), 190, 1.3);
      B.rect(cx - 74, b - 110, 148, 110);
      solid(col(72, 70, 62), 210, 1.3);
      B.beginShape();
      B.vertex(cx - 84, b - 108);
      B.vertex(cx, b - 176);
      B.vertex(cx + 84, b - 108);
      B.endShape(p.CLOSE);
      solid(col(0, 20, 98), 230, 1);
      B.circle(cx, b - 130, 15);
      line(1.2);
      B.line(cx, b - 176, cx, b - 204);
      wash(col(72, 85, 62), 230, 0.2, 0.3);
      B.beginShape();
      B.vertex(cx, b - 204);
      B.vertex(cx + 26, b - 196);
      B.vertex(cx, b - 188);
      B.endShape(p.CLOSE);
      for (const dx of [-52, -22, 22, 52]) win(cx + dx - 9, b - 88, 18, 24, col(300, 70, 84));
      solid(col(0, 40, 40), 200, 1);
      B.rect(cx - 12, b - 52, 24, 52);
    } else if (kind === "build") {
      solid(col(127, 80, 78), 200, 1.2);
      B.rect(cx - 50, b - 96, 100, 96);
      shade(col(0, 40, 40), 8, 130);
      B.rect(cx - 50, b - 96, 100, 96);
      noHatch();
      line(1.8);
      B.line(cx + 58, b, cx + 58, b - 235);
      B.line(cx + 74, b, cx + 74, b - 235);
      for (let y = b - 20; y > b - 230; y -= 34) B.line(cx + 58, y, cx + 74, y - 18);
      B.line(cx - 100, b - 235, cx + 100, b - 235);
      B.line(cx - 100, b - 235, cx - 100, b - 175);
      wash(col(127, 95, 68), 230, 0.25, 0.4);
      B.rect(cx - 112, b - 175, 24, 20);
      for (let x2 = cx - 36; x2 < cx + 38; x2 += 36) win(x2, b - 70, 20, 24, col(300, 60, 86));
    } else if (kind === "shop") {
      solid(col(0, 25, 96), 200, 1.3);
      B.rect(cx - 66, b - 112, 132, 112);
      for (let i = 0; i < 6; i++) {
        solid(i % 2 ? col(0, 20, 98) : col(72, 80, 66), 225, 1);
        B.rect(cx - 72 + i * 24, b - 128, 24, 34);
      }
      win(cx - 52, b - 80, 50, 44, col(300, 70, 82));
      solid(col(0, 40, 40), 200, 1);
      B.rect(cx + 14, b - 80, 30, 80);
      wash(col(127, 95, 70), 220, 0.3, 0.4);
      B.rect(cx + 20, b - 70, 18, 22);
      line(1.1);
      B.spline([[cx + 22, b - 70], [cx + 30, b - 82], [cx + 38, b - 70]], 0.7);
    } else if (kind === "game") {
      solid(col(300, 65, 74), 200, 1.3);
      B.rect(cx - 62, b - 150, 124, 150);
      solid(col(0, 50, 16), 230, 1);
      B.rect(cx - 46, b - 128, 92, 56);
      wash(col(330, 85, 66), 230, 0.3, 0.4);
      B.circle(cx - 18, b - 102, 9);
      B.circle(cx + 18, b - 102, 9);
      line(1.6);
      B.line(cx - 6, b - 102, cx + 6, b - 102);
      wash(col(127, 95, 70), 230, 0.3, 0.4);
      B.circle(cx - 28, b - 40, 9);
      wash(col(72, 85, 62), 230, 0.3, 0.4);
      B.circle(cx + 4, b - 40, 9);
      B.circle(cx + 28, b - 40, 9);
    } else if (kind === "ads") {
      line(2);
      B.line(cx - 40, b, cx - 40, b - 96);
      B.line(cx + 40, b, cx + 40, b - 96);
      solid(col(0, 20, 98), 235, 1.4);
      B.rect(cx - 82, b - 190, 164, 96);
      wash(col(72, 85, 66), 225, 0.3, 0.4);
      B.beginShape();
      B.vertex(cx - 52, b - 150);
      B.vertex(cx + 14, b - 176);
      B.vertex(cx + 14, b - 112);
      B.endShape(p.CLOSE);
      B.rect(cx - 66, b - 154, 18, 28);
      line(1.2);
      B.spline([[cx + 28, b - 164], [cx + 44, b - 150], [cx + 28, b - 136]], 0.6);
      B.spline([[cx + 40, b - 172], [cx + 64, b - 150], [cx + 40, b - 128]], 0.6);
    } else if (kind === "office") {
      solid(col(212, 45, 78), 200, 1.3);
      B.rect(cx - 46, b - 238, 92, 238);
      shade(col(0, 40, 35), 6, 55);
      B.rect(cx - 46, b - 238, 92, 238);
      noHatch();
      for (let y = b - 218; y < b - 40; y += 36) for (let x = cx - 32; x < cx + 28; x += 30) win(x, y, 16, 20, col(300, 70, 90));
      solid(col(0, 40, 40), 200, 1);
      B.rect(cx - 12, b - 44, 24, 44);
      line(1.2);
      B.line(cx, b - 238, cx, b - 262);
    } else {
      solid(col(72, 45, 88), 200, 1.3);
      B.rect(cx - 56, b - 90, 112, 90);
      solid(col(0, 55, 55), 210, 1.3);
      B.beginShape();
      B.vertex(cx - 68, b - 88);
      B.vertex(cx, b - 150);
      B.vertex(cx + 68, b - 88);
      B.endShape(p.CLOSE);
      win(cx - 40, b - 66, 24, 26, col(300, 70, 86));
      win(cx + 16, b - 66, 24, 26, col(300, 70, 86));
      solid(col(0, 40, 40), 200, 1);
      B.rect(cx - 10, b - 50, 20, 50);
    }
  };
  kinds.forEach((k, i) => house(k, slotX(i, n)));

  // ---- the foreground: grass tufts and a few birds ---------------------------------------------------------------------------------------
  line(0.9);
  for (let i = 0; i < 26; i++) {
    const gx = -580 + i * 47 + ((i * 37) % 19);
    const gy = BASE + 56 + ((i * 53) % 46);
    B.line(gx, gy, gx - 3, gy - 12);
    B.line(gx + 4, gy, gx + 6, gy - 14);
  }
  for (const [bx, by] of [[-250, -120], [-205, -140], [330, -140], [370, -118]] as const) {
    line(1.2);
    B.spline([[bx - 14, by + 4], [bx, by - 6], [bx + 14, by + 4]], 0.6);
  }
}

export function BrushTown({ kinds, layer, className, onReady }: { kinds: Kind[]; layer: Layer; className?: string; onReady?: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "fail">("loading");

  useEffect(() => {
    let disposed = false;
    let inst: any = null;
    let off: (() => void) | null = null;
    let watch: IntersectionObserver | null = null;
    // p5 + p5.brush are about 350 KB: they are downloaded when the painted town is within about one screen of the visitor, not with the page
    const start = async () => {
      try {
        const [p5mod, brush] = await Promise.all([import("p5"), import("p5.brush")]);
        if (disposed || !host.current) return;
        const P5: any = (p5mod as any).default ?? p5mod;
        const sketch = (p: any) => {
          (brush as any).instance(p);
          // p5.brush is one shared object: before anything is done with a canvas it must be pointed at the p5 of that canvas (there are two canvases)
          p.setup = () => {
            (brush as any).instance(p);
            p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
            p.createCanvas(TOWN_W, TOWN_H, p.WEBGL);
            (brush as any).scaleBrushes(2.4);
            p.noLoop();
          };
          p.draw = () => {
            (brush as any).instance(p);
            (brush as any).load();
            const t = liveTheme();
            paintTown(p, brush, t, kinds, layer);
          };
        };
        inst = new P5(sketch, host.current);
        const redraw = () => inst && inst.redraw();
        window.addEventListener(THEME_EVENT, redraw);
        off = () => window.removeEventListener(THEME_EVENT, redraw);
        setState("ready");
        onReady?.();
      } catch {
        if (!disposed) setState("fail");
      }
    };
    if (host.current && typeof IntersectionObserver !== "undefined") {
      watch = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          watch?.disconnect();
          void start();
        },
        { rootMargin: "900px 0px" },
      );
      watch.observe(host.current);
    } else {
      void start();
    }
    return () => {
      disposed = true;
      watch?.disconnect();
      off?.();
      inst?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kinds, layer]);

  return (
    <div className={`gfx-paint gfx-paint-${layer} ${className ?? ""}`} data-state={state}>
      <div ref={host} className="gfx-paint-canvas" aria-hidden="true" />
    </div>
  );
}
