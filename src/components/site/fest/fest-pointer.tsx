"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DiyaShape, Rangoli } from "./fest-art";
import { festEngine } from "./fest-engine";

// THE POINTER EFFECTS (Admin > Fest, "Pointer effects"): six things the mouse can do in a festival.
//   sparkler    small sparks follow the mouse                        (engine particles)
//   rocket      a click on an EMPTY part of a page (no text, no button, no link) launches a rocket from the click point; it climbs a random
//               height, always staying on the screen, and bursts
//   diya        a small flame with a warm glow follows the mouse a little behind
//   petaltrail  marigold petals fall from the mouse as it moves      (engine particles)
//   bloom       a click draws a small rangoli that opens and fades
//   chakri      a spinning fire wheel follows the mouse and throws sparks
// Only for a real mouse (pointer: fine) and without reduced motion. The particles are drawn by the engine of fest-top.tsx (they appear on its
// near layer); the diya and the chakri are two small DOM pieces. Nothing takes a click away from the page.

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// what counts as "something to click or read": the rocket and the bloom keep away from it
const INTERACTIVE = 'a,button,input,textarea,select,summary,label,video,audio,iframe,[role="button"],[role="link"],[role="tab"],[role="dialog"],[role="menu"],[contenteditable="true"],[data-fest-nofx]';

/** true when the click landed on an empty part of the page: not on a control and not on text */
export function isEmptyArea(target: EventTarget | null): boolean {
  const el = target instanceof Element ? target : null;
  if (!el) return false;
  if (el.closest(INTERACTIVE)) return false;
  // text: the element itself holds words (a heading, a paragraph, a span with text ...)
  for (const n of Array.from(el.childNodes)) if (n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim()) return false;
  if (el.matches("p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,code,td,th,dt,dd,figcaption,strong,em,b,i,u,mark,small,sup,sub")) return false;
  return true;
}

/** the margin at the top of the window that a rocket never goes above (px) */
export const ROCKET_TOP = 56;

/** where a rocket launched at height `cy` (px from the top of the window) bursts: a random height above the click, always on the screen and
 *  never above ROCKET_TOP. `r` is a random number from 0 to 1. */
export function rocketTarget(cy: number, r: number): number {
  const avail = cy - ROCKET_TOP;
  const rise = avail < 60 ? Math.max(18, avail * 0.6) : (0.35 + r * 0.57) * avail;
  return Math.max(ROCKET_TOP, cy - rise);
}

export function FestPointer({ fx }: { fx: ReadonlySet<string> }) {
  const diyaEl = useRef<HTMLDivElement>(null);
  const chakriEl = useRef<HTMLDivElement>(null);
  const [blooms, setBlooms] = useState<{ id: number; x: number; y: number; hue: number }[]>([]);
  const want = (k: string) => fx.has(k);
  const key = ["sparkler", "rocket", "diya", "petaltrail", "bloom", "chakri"].map((k) => (want(k) ? 1 : 0)).join("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const on = (k: string) => fx.has(k);
    let x = -200;
    let y = -200;
    let seen = false;
    let lastSpark = 0;
    let lastPetal = 0;
    let lastRocket = 0;
    let lx = -200; // where the followers are
    let ly = -200;
    let raf = 0;
    let lastT = 0;
    let lastChakri = 0;
    let angle = 0;
    let bloomId = 0;
    const timers: number[] = [];

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016;
      lastT = now;
      const k = 1 - Math.exp(-dt * 9);
      lx += (x - lx) * k;
      ly += (y - ly) * k;
      const d = diyaEl.current;
      if (d) {
        d.style.transform = `translate3d(${(lx + 12).toFixed(1)}px, ${(ly + 14).toFixed(1)}px, 0)`;
        d.style.opacity = seen ? "1" : "0";
      }
      const c = chakriEl.current;
      if (c) {
        c.style.transform = `translate3d(${(lx + 16).toFixed(1)}px, ${(ly + 16).toFixed(1)}px, 0)`;
        c.style.opacity = seen ? "1" : "0";
        angle += dt * 900;
        const e = festEngine();
        if (e && seen && now - lastChakri > 34) {
          lastChakri = now;
          const a = (angle * Math.PI) / 180;
          const px = lx + 16 + Math.cos(a) * 15;
          const py = ly + 16 + Math.sin(a) * 15;
          e.spark(px, py, { vx: Math.cos(a + 1.5) * 170 + rnd(-40, 40), vy: Math.sin(a + 1.5) * 170 + rnd(-40, 40) - 30, ay: 260, life: rnd(0.3, 0.6), size: rnd(1.2, 2), depth: 2 });
        }
      }
    };

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        lx = x;
        ly = y;
      }
      const now = performance.now();
      const eng = festEngine();
      if (!eng) return;
      if (on("sparkler") && now - lastSpark > 24) {
        lastSpark = now;
        for (let i = 0; i < 2; i++) eng.spark(x + rnd(-2, 2), y + rnd(-2, 2), { vx: rnd(-50, 50), vy: rnd(-70, 20), life: rnd(0.4, 0.85), size: rnd(1.2, 2.3), depth: 2 });
      }
      if (on("petaltrail") && now - lastPetal > 110) {
        lastPetal = now;
        eng.petal(x + rnd(-6, 6), y + rnd(0, 8), { depth: 2, vx: rnd(-26, 26), vy: rnd(24, 60), size: rnd(5, 8.5) });
      }
    };
    const leave = () => {
      seen = false;
    };

    const click = (e: MouseEvent) => {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const eng = festEngine();
      const empty = isEmptyArea(e.target);
      const cx = e.clientX;
      const cy = e.clientY;
      if (on("rocket") && eng && empty) {
        const now = performance.now();
        if (now - lastRocket > 180) {
          lastRocket = now;
          // it climbs a random height from the click point and bursts somewhere on the screen, never above a margin at the top
          const ty = rocketTarget(cy, Math.random());
          eng.rocket(cx, cy, ty, { depth: 2, scale: Math.min(1.2, 0.7 + (cy - ty) / window.innerHeight) });
          for (let i = 0; i < 6; i++) eng.spark(cx, cy, { vx: rnd(-90, 90), vy: rnd(-120, -20), life: rnd(0.25, 0.5), size: rnd(1.2, 2), depth: 2 });
        }
      }
      if (on("bloom") && !e.defaultPrevented && !(e.target instanceof Element && e.target.closest(INTERACTIVE))) {
        const id = ++bloomId;
        setBlooms((b) => [...b.slice(-5), { id, x: cx, y: cy, hue: Math.round(rnd(-40, 40)) }]);
        timers.push(window.setTimeout(() => setBlooms((b) => b.filter((v) => v.id !== id)), 1900));
        if (eng) for (let i = 0; i < 5; i++) eng.petal(cx + rnd(-20, 20), cy + rnd(-20, 20), { depth: 2, vx: rnd(-50, 50), vy: rnd(-30, 20), size: rnd(5, 8) });
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("click", click);
    if (on("diya") || on("chakri")) raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("click", click);
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` stands for the six switches
  }, [key]);

  return (
    <div className="fs-pointer" aria-hidden>
      {want("diya") && (
        <div ref={diyaEl} className="fs-diya-cur">
          <DiyaShape w={26} />
          <b />
        </div>
      )}
      {want("chakri") && (
        <div ref={chakriEl} className="fs-chakri-cur">
          <i />
        </div>
      )}
      {blooms.map((b) => (
        <i key={b.id} className="fs-bloom" style={{ left: b.x, top: b.y } as CSSProperties}>
          <Rangoli size={96} hue={b.hue} />
        </i>
      ))}
    </div>
  );
}
