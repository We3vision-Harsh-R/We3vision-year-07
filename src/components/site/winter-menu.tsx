"use client";

import { useEffect, useRef } from "react";
import { Ball, House, Snowman, WinterDefs } from "./winter-art";
import { createWorld, type Floor, type Measured, type Spec, type World } from "./winter-world";

/**
 * WINTER WORLD in the big menu (task 153, owner 2026-11-19; the physics moved to winter-world.ts in task 154).
 *
 *  - The lines under the headings of the menu (Development, Creatives ... Our products, Explore, Industrial training) and the bottom of the panel are
 *    FLOORS. They are measured from the real elements, so the world fits every width of the menu.
 *  - Two small snowmen and two snowballs stand on the floors where the owner marked them; a small snow house stands on the bottom floor.
 *  - Drag, drop, bounce, roll, hop: see winter-world.ts. Positions are kept while the menu is closed.
 *  - Laptop/desktop only (the layer is hidden below 1024px by CSS), pointer-events only on the items themselves, the loop sleeps when nothing moves.
 */

const GID = "wm-g";

// the places the owner marked on his screenshot, as a fraction along the floor ("expl" = the Explore + Industrial training line, "bottom" = the panel floor)
const SPECS: Spec[] = [
  { id: "man-a", kind: "man", w: 38, h: 50, floor: "expl", f: 0.232 },
  { id: "ball-b", kind: "ball", w: 26, h: 26, floor: "expl", f: 0.334 },
  { id: "ball-c", kind: "ball", w: 24, h: 24, floor: "bottom", f: 0.315 },
  { id: "man-d", kind: "man", w: 44, h: 58, floor: "bottom", f: 0.471 },
];
const HOUSE = { w: 168, h: 55, f: 0.82 };

export function WinterMenu({ open }: { open: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const world = useRef<World | null>(null);

  // the world is built once: the items keep their place while the menu is closed
  useEffect(() => {
    const layer = layerRef.current;
    const pop = layer?.parentElement;
    if (!layer || !pop) return;
    const house = layer.querySelector<HTMLElement>(".wm-house");
    let span = { x0: 0, x1: 0 }; // the part of the bottom floor where the owner's places were marked (from the left of the menu to the column on the right)

    // the rows of the menu rise one after the other when it opens (a translateY): the floors are measured without it
    const rise = (el: Element) => {
      const m = el.closest(".mm-r");
      if (!m) return 0;
      const t = getComputedStyle(m).transform;
      if (!t || t === "none") return 0;
      try {
        return new DOMMatrixReadOnly(t).m42;
      } catch {
        return 0;
      }
    };

    const measure = (): Measured | null => {
      const lr = layer.getBoundingClientRect();
      const s = lr.width / (layer.offsetWidth || 1) || 1;
      const W = layer.offsetWidth;
      const H = layer.offsetHeight;
      if (W < 300 || H < 200) return null;
      const raw: Floor[] = [];
      pop.querySelectorAll<HTMLElement>(".mm-sub-t, .mm-row3 .mm-col-t").forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.width < 30 || r.height < 4) return;
        const key = el.closest(".mm-expl") ? "expl" : el.closest(".mm-train") ? "train" : el.closest(".mm-prod") ? "prod" : `sub${i}`;
        raw.push({ keys: [key], x0: (r.left - lr.left) / s, x1: (r.right - lr.left) / s, y: (r.bottom - lr.top) / s - rise(el) - 1 });
      });
      raw.sort((a, b) => a.y - b.y || a.x0 - b.x0);
      // lines that touch each other on the same height are one floor (Explore + Industrial training)
      const merged: Floor[] = [];
      for (const f of raw) {
        const prev = merged[merged.length - 1];
        // (Explore and Industrial training are one floor even when there is a gap between their lines: the owner drew one line)
        if (prev && Math.abs(prev.y - f.y) < 3 && (f.x0 - prev.x1 < 40 || (prev.keys.includes("expl") && f.keys.includes("train")))) {
          prev.x1 = Math.max(prev.x1, f.x1);
          prev.keys.push(...f.keys);
        } else merged.push({ ...f, keys: [...f.keys] });
      }
      const nav = pop.querySelector<HTMLElement>(".mm-nav");
      if (!nav) return null;
      const nr = nav.getBoundingClientRect();
      const end = pop.querySelector<HTMLElement>(".mm-end");
      const navL = (nr.left - lr.left) / s;
      const navR = (nr.right - lr.left) / s; // (the right end of the menu text)
      const endL = end && end.getBoundingClientRect().width > 20 ? (end.getBoundingClientRect().left - lr.left) / s - 6 : navR;
      span = { x0: navL, x1: endL };
      const bottom: Floor = { keys: ["bottom"], x0: 0, x1: W, y: H - 10 }; // the panel floor: the whole width, so nothing can fall out of the menu
      const floors = [...merged, bottom].sort((a, b) => a.y - b.y);
      return {
        W,
        H,
        floors,
        safety: bottom,
        home: (sp) => {
          const fl = (sp.floor === "expl" ? floors.find((f) => f.keys.includes("expl")) : bottom) ?? bottom;
          const r = fl.keys.includes("bottom") ? span : fl;
          return { fl, x: r.x0 + sp.f * (r.x1 - r.x0) };
        },
        after: () => {
          if (!house) return;
          const hx = span.x0 + HOUSE.f * (span.x1 - span.x0);
          house.style.transform = `translate(${(hx - HOUSE.w / 2).toFixed(1)}px,${(bottom.y - HOUSE.h + 2).toFixed(1)}px)`;
        },
      };
    };

    const w = createWorld({ layer, host: pop, specs: SPECS, measure });
    world.current = w;
    return () => {
      world.current = null;
      w.destroy();
    };
  }, []);

  // each time the menu opens the floors are measured again (the panel grows out of the menu and its rows rise one after the other)
  useEffect(() => {
    const w = world.current;
    const layer = layerRef.current;
    if (!w || !layer) return;
    if (!open) {
      w.cancel();
      return;
    }
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const run = () => world.current?.layout();
    run();
    const ids = [80, 400, 900, 1500, 2200].map((ms) => window.setTimeout(run, ms));
    const ro = new ResizeObserver(run);
    ro.observe(layer);
    const scroller = layer.parentElement?.querySelector(".mm-in");
    scroller?.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      ro.disconnect();
      scroller?.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
    };
  }, [open]);

  return (
    <div ref={layerRef} className="wm" aria-hidden>
      <WinterDefs gid={GID} />
      <div className="wm-house" style={{ width: HOUSE.w, height: HOUSE.h }}>
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
