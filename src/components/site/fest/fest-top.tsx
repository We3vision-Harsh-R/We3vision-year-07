"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { FestDensity } from "@/lib/fest";
import { Diya, Kandil, Rangoli, SkyLantern, ToranGarland } from "./fest-art";
import { FestEngine, setFestEngine } from "./fest-engine";

// THE LAYER ABOVE THE WHOLE PAGE (Admin > Fest, "Whole-website effects"). Everything festive that is drawn over the page lives here, in three
// layers that are three distances from the screen: far (small, slow, soft with blur, behind), middle, and near (big, sharp, in front). The
// layers also move a little against the mouse (parallax), so the effects stand in a 3D space. Nothing here takes a click (pointer-events:
// none) and nothing changes the layout of the page. The blur of the far layers is on the layer itself (one filter per layer).
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

// sky lanterns: [x %, size, rise seconds, delay seconds] for each distance
const LANTERN_SETS: { z: 0 | 1 | 2; s: number; t: number; n: number }[] = [
  { z: 0, s: 0.42, t: 52, n: 6 },
  { z: 1, s: 0.72, t: 38, n: 4 },
  { z: 2, s: 1.15, t: 28, n: 3 },
];
// akash kandils: [x %, cord px, size] for each distance (the middle of the top stays free for the logo)
const KANDILS: { z: 0 | 1 | 2; x: number; len: number; s: number }[] = [
  { z: 2, x: 4.5, len: 46, s: 1.08 },
  { z: 2, x: 95.5, len: 92, s: 1.12 },
  { z: 1, x: 17, len: 78, s: 0.72 },
  { z: 1, x: 83, len: 40, s: 0.7 },
  { z: 0, x: 31, len: 30, s: 0.44 },
  { z: 0, x: 69, len: 64, s: 0.44 },
];

export function FestTop({ fx, density }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const cv = [useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null)];
  const [vw, setVw] = useState(1440);
  const [still, setStill] = useState(false);
  const engine = useRef<FestEngine | null>(null);
  const dens = D[density];

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
    const e = new FestEngine(els as HTMLCanvasElement[], density);
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
    e.setDensity(density);
    e.setAmbient({ fireworks: fx.has("fireworks"), embers: fx.has("embers"), petals: fx.has("petals"), anar: fx.has("anar") });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ambientKey stands for the four switches
  }, [canvasOn, ambientKey, density]);

  // the layers lean against the mouse: far a little, near more (set as two numbers on the root, applied by CSS)
  useEffect(() => {
    const el = root.current;
    if (!el || still || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let mx = 0;
    let my = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", mx.toFixed(3));
      el.style.setProperty("--my", my.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [still]);

  const scallops = Math.ceil(vw / 200) + 1;
  const diyaGap = density === "low" ? 150 : density === "rich" ? 84 : 112;

  // the DOM pieces of one distance
  const layer = (z: 0 | 1 | 2) => (
    <div className="fs-lay" data-z={z}>
      {fx.has("skylanterns") &&
        LANTERN_SETS.filter((l) => l.z === z).flatMap((set) =>
          Array.from({ length: Math.max(1, Math.round(set.n * dens)) }, (_, i) => (
            <i
              key={`l${z}${i}`}
              className="fs-lantern"
              style={{ "--x": `${4 + hash(i + z * 9) * 92}%`, "--s": set.s, "--t": `${set.t * (0.85 + hash(i, 3) * 0.3)}s`, "--d": `${-hash(i, z + 7) * set.t}s` } as CSSProperties}
            >
              <SkyLantern />
            </i>
          )),
        )}
      {fx.has("kandils") &&
        KANDILS.filter((k) => k.z === z).map((k, i) => (
          <i key={`k${z}${i}`} className="fs-kandil" style={{ "--x": `${k.x}%`, "--s": k.s, "--len": `${k.len}px`, "--d": `${-hash(i, z + 2) * 4}s` } as CSSProperties}>
            <u className="fs-cord" />
            <Kandil />
          </i>
        ))}
      {fx.has("toran") && z === 2 && (
        <div className="fs-toran is-near">
          <ToranGarland scallops={scallops} seg={200} sag={34} />
        </div>
      )}
      {fx.has("toran") && z === 0 && (
        <div className="fs-toran is-far">
          <ToranGarland scallops={Math.ceil(vw / 150) + 1} seg={150} sag={24} bulbSize={2.8} />
        </div>
      )}
      {fx.has("diyaline") &&
        (() => {
          // three rows of diyas along the bottom edge: the near row big and sharp, the far one small and soft
          const gap = diyaGap * (z === 2 ? 1 : z === 1 ? 0.8 : 0.62);
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
      {fx.has("rangoli") && z === 0 && (
        <i className="fs-rangoli is-tr">
          <Rangoli size={Math.round(Math.min(vw, 1000) * 0.3)} hue={-24} />
        </i>
      )}
    </div>
  );

  return (
    <div ref={root} className="fs-top" data-still={still} aria-hidden>
      {fx.has("glow") && (
        <div className="fs-glow">
          <i className="fs-glow-l" />
          <i className="fs-glow-r" />
          <i className="fs-rays" />
        </div>
      )}
      {([0, 1, 2] as const).map((z) => (
        <div key={z} className="fs-depth" data-z={z}>
          {canvasOn && <canvas ref={cv[z]} className="fs-cv" data-z={z} />}
          {layer(z)}
        </div>
      ))}
    </div>
  );
}
