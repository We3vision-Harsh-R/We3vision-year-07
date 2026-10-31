"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { FestDensity } from "@/lib/fest";
import { Diya, Kandil, Rangoli, SkyLantern, ToranGarland } from "./fest-art";
import { FestEngine, setFestEngine } from "./fest-engine";

// THE LAYER ABOVE THE WHOLE PAGE (Admin > Fest, "Whole-website effects"). Everything festive that is drawn over the page lives here, in three
// layers that are three distances from the screen: far (small, slow, soft with blur, behind), middle, and near (big, sharp, in front). The
// layers also move a little against the mouse (parallax), so the effects stand in a 3D space. Nothing here takes a click (pointer-events:
// none) and nothing changes the layout of the page.
// SPEED: there is no filter, blend or opacity on a whole layer (that would make the graphics card redo the full screen every frame). The blur of
// the distance sits on the still drawing inside each moving piece (painted once, then only moved), the particles of the far distances are on a
// half-resolution canvas (soft by itself), and only transform / opacity are animated.
//   DOM pieces: sky lanterns, akash kandils, toran garland, diya line, rangoli corners, golden glow with light rays
//   canvas pieces (fest-engine.ts): fireworks, golden embers, marigold petals, anar fountains (and the pointer effects)
// Styles: src/styles/fest.css ("fs-"). With reduced motion nothing moves: the still pieces stay, the canvases are not made.

type Props = { fx: ReadonlySet<string>; density: FestDensity };

const D = { low: 0.55, normal: 1, rich: 1.5 } as const;
/** a repeatable "random" number from an index (no Math.random in render: server and browser must draw the same) */
const hash = (i: number, salt = 0) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// NOTHING MAY HIDE THE CONTENT (owner, 2026-10-24): the pieces that stay on the screen keep to the edges of the window. The page itself starts
// about 5 vw from the sides, the logo is in the middle of the top and the recognitions (Startup India, MSME) are in the two top corners, so:
//   the toran hangs in two pieces between the corners and the logo (SIDE_GARLANDS), short, close to the top edge;
//   the kandils hang at the very left and right edge (outside the page's own margin);
//   the sky lanterns rise in the two side bands only.
// sky lanterns: [size, rise seconds, how many] for each distance; their x is in the side bands (0-8 % and 92-100 %)
const LANTERN_SETS: { z: 0 | 1 | 2; s: number; t: number; n: number }[] = [
  { z: 0, s: 0.42, t: 52, n: 4 },
  { z: 1, s: 0.72, t: 38, n: 3 },
  { z: 2, s: 1.0, t: 28, n: 2 },
];
const sideX = (r: number) => (r < 0.5 ? 0.5 + r * 15 : 91.5 + (r - 0.5) * 15); // a random 0..1 -> a % in one of the side bands
// akash kandils: [x %, cord px, size] for each distance: only at the outer edges
const KANDILS: { z: 0 | 1 | 2; x: number; len: number; s: number }[] = [
  { z: 2, x: 2.3, len: 40, s: 0.9 },
  { z: 2, x: 97.7, len: 84, s: 0.92 },
  { z: 0, x: 3.6, len: 128, s: 0.42 },
  { z: 0, x: 96.4, len: 22, s: 0.42 },
];
/** the two pieces of the toran: [from %, to %] of the window width (the corners and the logo stay free) */
const SIDE_GARLANDS: [number, number][] = [
  [16, 40],
  [60, 84],
];

export function FestTop({ fx, density }: Props) {
  const root = useRef<HTMLDivElement>(null);
  // two canvases: the soft back one (far + middle particles, half the pixels) and the sharp front one (near particles)
  const cv = [useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null)];
  const [vw, setVw] = useState(1440);
  const [still, setStill] = useState(false);
  const engine = useRef<FestEngine | null>(null);
  // a phone / tablet gets the light amount (fewer pieces, a lighter canvas) and no big pieces in front: nothing may sit on the text or make the page lag
  const phone = vw < 1024;
  const eff: FestDensity = phone ? "low" : density;
  const dens = D[eff];

  const needCanvas = ["fireworks", "embers", "petals", "anar", "sparkler", "rocket", "petaltrail", "chakri", "bloom"].some((k) => fx.has(k));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setStill(mq.matches);
      setVw(window.innerWidth);
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  // the engine: made once while some canvas effect is on, told what is on
  const canvasOn = needCanvas && !still;
  useEffect(() => {
    if (!canvasOn) return;
    const els = cv.map((r) => r.current);
    if (els.some((e) => !e)) return;
    const e = new FestEngine(els as HTMLCanvasElement[], eff);
    engine.current = e;
    setFestEngine(e);
    return () => {
      e.destroy();
      engine.current = null;
      setFestEngine(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the canvases are fixed refs; the density and the switches are applied by the effect below
  }, [canvasOn]);
  const ambientKey = ["fireworks", "embers", "petals", "anar"].map((k) => (fx.has(k) ? 1 : 0)).join("");
  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    e.setDensity(eff);
    e.setAmbient({ fireworks: fx.has("fireworks"), embers: fx.has("embers"), petals: fx.has("petals"), anar: fx.has("anar") });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ambientKey stands for the four switches
  }, [canvasOn, ambientKey, eff]);

  // NOTE (round 5): a pointer handler used to write --mx/--my on the root here (layers leaning against the mouse, fest.css .fs-lay). It never had an
  // effect: globals.css registers --mx as <length-percentage>, so the unit-less number was invalid and the layers stayed where they are. The writes
  // only made the browser recalculate the style of every lantern and diya on every mouse move, so they are gone (the look is the same). To make the
  // layers lean for real, write a NEW number property (registered inherits:false, like --rcx in contact.css) on the three .fs-lay elements.

  const diyaGap = eff === "low" ? 150 : eff === "rich" ? 84 : 112;

  // the DOM pieces of one distance
  const layer = (z: 0 | 1 | 2) => (
    <div className="fs-lay" data-z={z}>
      {fx.has("skylanterns") &&
        LANTERN_SETS.filter((l) => l.z === z && !(phone && z === 2)).flatMap((set) =>
          Array.from({ length: Math.max(1, Math.round(set.n * dens)) }, (_, i) => (
            <i
              key={`l${z}${i}`}
              className="fs-lantern"
              style={{ "--x": `${sideX(hash(i + z * 9))}%`, "--s": set.s, "--t": `${set.t * (0.85 + hash(i, 3) * 0.3)}s`, "--d": `${-hash(i, z + 7) * set.t}s` } as CSSProperties}
            >
              <SkyLantern />
            </i>
          )),
        )}
      {fx.has("kandils") &&
        KANDILS.filter((k) => k.z === z && !(phone && z === 2)).map((k, i) => (
          <i key={`k${z}${i}`} className="fs-kandil" style={{ "--x": `${k.x}%`, "--s": k.s, "--len": `${k.len}px`, "--T": `${(Math.PI * Math.sqrt((k.len + 52 * k.s) / 60 / 9.8)).toFixed(2)}s`, "--d": `${-hash(i, z + 2) * 4}s` } as CSSProperties}>
            <u className="fs-cord" />
            <Kandil />
          </i>
        ))}
      {fx.has("toran") &&
        z !== 1 &&
        SIDE_GARLANDS.map(([a, b], k) => {
          // a whole number of scallops that fills the piece exactly (no cut flower at its ends)
          const w = ((b - a) / 100) * vw;
          const n = Math.max(1, Math.round(w / (z === 2 ? 170 : 130)));
          return (
            <div key={k} className={`fs-toran ${z === 2 ? "is-near" : "is-far"}`} style={{ left: `${a}%`, width: `${b - a}%` }}>
              <ToranGarland scallops={n} seg={w / n} sag={z === 2 ? 14 : 10} bulbSize={z === 2 ? 3.2 : 2.6} />
            </div>
          );
        })}
      {fx.has("diyaline") &&
        (() => {
          // two rows of diyas along the very bottom edge: the near row big and sharp, the middle one smaller (no third row: less over the page)
          if (z === 0) return null;
          const gap = diyaGap * (z === 2 ? 1 : 0.8);
          const n = Math.ceil(vw / gap) + 1;
          return (
            <div className="fs-diyaline" data-z={z}>
              {Array.from({ length: n }, (_, i) => {
                const at = i / (n - 1 || 1);
                if (at > 0.3 && at < 0.7) return null; // the menu bar stands here, at the bottom of the window
                return (
                  <span key={i} className="fs-dl-slot" style={{ left: `${at * 100}%`, "--j": `${(hash(i, z) - 0.5) * 8}px` } as CSSProperties}>
                    <Diya k={i + z * 5} w={z === 2 ? 28 : z === 1 ? 20 : 13} className="fs-dl" />
                  </span>
                );
              })}
            </div>
          );
        })()}
      {fx.has("rangoli") && z === 2 && (
        <i className="fs-rangoli is-bl">
          <Rangoli size={Math.round(Math.min(vw, 1000) * 0.24)} />
        </i>
      )}
      {/* (one rangoli only: the top corner belongs to the recognitions) */}
    </div>
  );

  return (
    <div ref={root} className="fs-top" data-still={still} aria-hidden>
      {fx.has("glow") && (
        <div className="fs-glow">
          <i className="fs-glow-l" />
          <i className="fs-glow-r" />
          <i className="fs-rays">
            <i />
          </i>
        </div>
      )}
      {([0, 1, 2] as const).map((z) => (
        <div key={z} className="fs-depth" data-z={z}>
          {canvasOn && z !== 1 && <canvas ref={cv[z === 0 ? 0 : 1]} className="fs-cv" data-z={z} />}
          {layer(z)}
        </div>
      ))}
    </div>
  );
}
