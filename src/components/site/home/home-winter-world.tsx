"use client";

import { useEffect, useRef } from "react";
import { Ball, House, Snowman, WinterDefs } from "../winter-art";
import { createWorld, type Floor, type Measured, type Solid, type Spec } from "../winter-world";

/**
 * WINTER WORLD in the products grid of the home page (task 154, owner 2026-11-19). The same physics as the big menu (winter-world.ts):
 *
 *  - The hairlines of the grid are FLOORS (the bottom line of every empty cell, which is also the top of the card below it), with a thin layer of snow on
 *    them. They are measured from the real grid, so they fit every width.
 *  - The cards are WALLS: nothing goes through them; something dropped on a card pops up onto its top.
 *  - Three small snowmen and four snowballs stand in the empty cells, a snow house stands in the middle one. Drag them, flick the balls, click a snowman.
 *  - When the section first comes into view, everything falls into place from a little above.
 *  - Laptop/desktop only (the layer is hidden below 1024px by CSS).
 */

const GID = "wh-g";
const MAN = { w: 56, h: 74 };

// where each item starts: the hairline (k1 = the line under the first row ...) and how far along the grid (0..1)
const SPECS: Spec[] = [
  { id: "man-1", kind: "man", ...MAN, floor: "k1", f: 0.8 },
  { id: "ball-1", kind: "ball", w: 28, h: 28, floor: "k1", f: 0.885 },
  { id: "man-2", kind: "man", ...MAN, floor: "k2", f: 0.62 },
  { id: "ball-2", kind: "ball", w: 34, h: 34, floor: "k3", f: 0.12 },
  { id: "man-3", kind: "man", ...MAN, floor: "k3", f: 0.23 },
  { id: "ball-3", kind: "ball", w: 26, h: 26, floor: "k4", f: 0.17 },
  { id: "ball-4", kind: "ball", w: 32, h: 32, floor: "k4", f: 0.5 },
];
const HOUSE = { w: 210, h: 69, k: "k2", f: 0.43 };
const SNOW = 4; // the feet stand this far above the hairline (in the snow)

// the soft snow on a floor: a lumpy top that thins out at both ends
function snowPath(x0: number, x1: number, lineY: number) {
  const pts: string[] = [];
  for (let x = x0; x <= x1 + 0.1; x += 4) {
    const e0 = Math.min(1, Math.min(x - x0, x1 - x) / 26);
    const e = e0 * e0 * (3 - 2 * e0);
    const h = (4.3 + 1.6 * Math.sin(x * 0.07) + 1.1 * Math.sin(x * 0.19 + 1.3) + 0.7 * Math.sin(x * 0.43)) * e;
    pts.push(`${x.toFixed(1)} ${(lineY - h).toFixed(2)}`);
  }
  const top = pts.join(" L");
  return {
    fill: `M${x0.toFixed(1)} ${(lineY + 1.5).toFixed(1)} L${top} L${x1.toFixed(1)} ${(lineY + 1.5).toFixed(1)} Z`,
    line: `M${top}`,
  };
}

export function HomeWinterWorld() {
  const layerRef = useRef<HTMLDivElement>(null);
  const capsRef = useRef<SVGSVGElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const grid = layer?.parentElement;
    const caps = capsRef.current;
    const house = houseRef.current;
    if (!layer || !grid || !caps || !house) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = (): Measured | null => {
      if (!mq.matches) return null;
      const cs = getComputedStyle(grid);
      const cw = cs.gridTemplateColumns.split(" ").map(parseFloat);
      const rh = cs.gridTemplateRows.split(" ").map(parseFloat);
      if (cw.length < 2 || rh.length < 2 || cw.some(Number.isNaN) || rh.some(Number.isNaN)) return null;
      const W = layer.offsetWidth;
      const H = layer.offsetHeight;
      if (W < 600 || H < 300) return null;
      const colX = cw.reduce<number[]>((a, v) => (a.push((a.length ? a[a.length - 1] : 0) + v), a), []); // the right end of each column
      const rowY = rh.reduce<number[]>((a, v) => (a.push((a.length ? a[a.length - 1] : 0) + v), a), []); // the bottom of each row
      const colL = (c: number) => (c ? colX[c - 1] : 0);

      // which cells hold a card (from their real place in the grid, without any slide-in transform)
      const occ = new Set<string>();
      const solids: Solid[] = [];
      grid.querySelectorAll<HTMLElement>(".hb2-card:not(.hb2-glide-copy)").forEach((card) => {
        const x0 = card.offsetLeft;
        const y0 = card.offsetTop;
        const c = colX.findIndex((end) => x0 < end - 2);
        const r = rowY.findIndex((end) => y0 < end - 2);
        if (c < 0 || r < 0) return;
        occ.add(`${r}-${c}`);
        solids.push({ x0, y0, x1: x0 + card.offsetWidth, y1: y0 + card.offsetHeight });
      });

      // a floor under every empty cell: its bottom hairline (neighbours on the same hairline are one floor)
      const floors: Floor[] = [];
      for (let k = 1; k <= rowY.length; k++) {
        const y = rowY[k - 1] - 1 - SNOW;
        let cur: Floor | null = null;
        for (let c = 0; c < colX.length; c++) {
          if (!occ.has(`${k - 1}-${c}`)) {
            if (cur) {
              cur.x1 = colX[c];
              cur.keys.push(`k${k}c${c}`);
            } else cur = { keys: [`k${k}c${c}`], x0: colL(c), x1: colX[c], y };
          } else if (cur) {
            floors.push(cur);
            cur = null;
          }
        }
        if (cur) floors.push(cur);
      }
      floors.sort((a, b) => a.y - b.y || a.x0 - b.x0);
      const safety: Floor = { keys: ["safe"], x0: 0, x1: W, y: H - 6 };
      const find = (k: string, x: number) => floors.find((f) => f.keys.some((kk) => kk.startsWith(`${k}c`)) && x >= f.x0 && x <= f.x1) ?? floors.find((f) => f.keys.some((kk) => kk.startsWith(`${k}c`)));

      return {
        W,
        H,
        floors,
        safety,
        solids,
        home: (sp) => {
          const x = sp.f * W;
          const fl = find(sp.floor, x) ?? safety;
          return { fl, x };
        },
        after: () => {
          // the snow on the floors
          let svg = `<defs><linearGradient id="wh-cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.55" stop-color="#e8f0ff"/><stop offset="1" stop-color="#b4c8e8"/></linearGradient></defs>`;
          for (const f of floors) {
            const p = snowPath(f.x0 + 1, f.x1 - 1, f.y + SNOW);
            svg += `<path d="${p.fill}" fill="url(#wh-cg)"/><path d="${p.line}" fill="none" stroke="rgba(255,255,255,0.95)" stroke-width="1"/>`;
          }
          caps.innerHTML = svg;
          // the house
          const hf = find(HOUSE.k, HOUSE.f * W);
          if (hf) {
            const hx = Math.min(hf.x1 - HOUSE.w / 2, Math.max(hf.x0 + HOUSE.w / 2, HOUSE.f * W)); // (inside its cell, also in a narrow window)
            house.style.transform = `translate(${(hx - HOUSE.w / 2).toFixed(1)}px,${(hf.y - HOUSE.h + 3).toFixed(1)}px)`;
          }
        },
      };
    };

    const w = createWorld({ layer, host: window, specs: SPECS, measure, holdReady: true });
    const run = () => w.layout();
    run();
    const ids = [120, 600, 1500].map((ms) => window.setTimeout(run, ms));
    const ro = new ResizeObserver(run);
    ro.observe(layer);
    window.addEventListener("resize", run);

    // the first time the section comes into view the snow shows itself and everything falls into place
    let shown = false;
    let dropT = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || shown) return;
        shown = true;
        layer.dataset.ready = "true";
        if (!reduce) dropT = window.setTimeout(() => w.drop(), 160);
      },
      { threshold: 0.3 },
    );
    io.observe(grid);

    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(dropT);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", run);
      w.destroy();
    };
  }, []);

  return (
    <div ref={layerRef} className="wm wh" aria-hidden>
      <WinterDefs gid={GID} />
      <svg ref={capsRef} className="wh-caps" aria-hidden />
      <div ref={houseRef} className="wm-house" style={{ width: HOUSE.w, height: HOUSE.h }}>
        <House />
      </div>
      {SPECS.map((s) => (
        <div key={s.id} data-wm={s.id} className={`wm-it wm-${s.kind}`} style={{ width: s.w, height: s.h }}>
          {s.kind === "man" ? <Snowman gid={GID} /> : <Ball s={s.w} gid={GID} />}
        </div>
      ))}
    </div>
  );
}
