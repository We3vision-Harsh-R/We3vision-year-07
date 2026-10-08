"use client";

import { useEffect, useRef, useState } from "react";
import { THEME_EVENT } from "@/lib/theme";
import type { OfficeScene } from "./office-scene";

// The first screen of the Metaverse page: an office in 3D. The page is tall and the stage stays on the screen (sticky): scrolling walks the
// visitor through the office to the table, where the headset waits; it comes up to the face and the view goes black.
// The 3D scene is loaded after the page (three.js is big), so the heading text is already there for visitors and search engines.
// Without WebGL, or for visitors who prefer less motion, the page shows a calm still of the table instead of the walk.

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
// the captions: when each one is on screen (progress of the scroll)
const WINDOWS: [number, number][] = [
  [0.02, 0.2],
  [0.3, 0.5],
  [0.62, 0.74],
  [0.76, 0.88],
];

const themeNow = () => {
  const cs = getComputedStyle(document.documentElement);
  const th = parseFloat(cs.getPropertyValue("--th"));
  const ts = parseFloat(cs.getPropertyValue("--ts"));
  return { hue: Number.isFinite(th) ? th : 284, sat: Number.isFinite(ts) ? ts : 1 };
};

export function VrOffice({ heading, text, hint, captions }: { heading: string; text: string; hint: string; captions: string[] }) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const capRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "still" | "fallback">("loading");

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!track || !stage || !canvas) return;
    let disposed = false;
    let raf = 0;
    let scene: OfficeScene | null = null;
    let visible = true;
    let last = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    const cleanups: (() => void)[] = [];

    const progress = () => {
      const r = track.getBoundingClientRect();
      const dist = Math.max(1, r.height - window.innerHeight);
      return clamp(-r.top / dist);
    };
    const overlays = (p: number, dark: number) => {
      if (blackRef.current) blackRef.current.style.opacity = String(dark);
      if (hintRef.current) hintRef.current.style.opacity = String(1 - smooth(p / 0.04));
      WINDOWS.forEach(([a, b], i) => {
        const el = capRefs.current[i];
        if (!el) return;
        const o = smooth((p - a) / 0.04) * (1 - smooth((p - (b - 0.04)) / 0.04));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!scene || !visible || document.hidden) {
        last = now;
        return;
      }
      const dt = now - last;
      last = now;
      const p = progress();
      scene.setProgress(p);
      scene.render(dt);
      overlays(p, scene.dark);
    };

    (async () => {
      try {
        const mod = await import("./office-scene");
        if (disposed) return;
        const t = themeNow();
        const s = mod.createOfficeScene(canvas, { mobile, hue: t.hue, sat: t.sat });
        scene = s;
        if (process.env.NODE_ENV !== "production") (window as unknown as { __vr?: OfficeScene }).__vr = s; // for looking at a single moment while developing
        const fit = () => {
          const r = stage.getBoundingClientRect();
          s.resize(Math.max(2, Math.round(r.width)), Math.max(2, Math.round(r.height)));
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(stage);
        const onTheme = () => {
          const n = themeNow();
          s.setTint(n.hue, n.sat);
        };
        window.addEventListener(THEME_EVENT, onTheme);
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
        io.observe(track);
        cleanups.push(() => {
          ro.disconnect();
          io.disconnect();
          window.removeEventListener(THEME_EVENT, onTheme);
          s.dispose();
        });
        if (reduced) {
          // a still picture of the table with the headset: no walk
          s.setProgress(0.72);
          for (let i = 0; i < 90; i++) s.render(16);
          overlays(0.7, 0);
          setState("still");
          return;
        }
        s.setProgress(progress());
        // the first frames: let the smoothing settle where the page already is
        for (let i = 0; i < 40; i++) s.render(16);
        setState("ready");
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } catch {
        if (!disposed) setState("fallback");
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <section ref={trackRef} id="top" className="vr" data-state={state} aria-label="Metaverse Solutions">
      <div ref={stageRef} className="vr-stage">
        <canvas ref={canvasRef} className="vr-canvas" aria-hidden />
        <div className="vr-vignette" aria-hidden />
        <div className="vr-captions">
          {captions.slice(0, WINDOWS.length).map((c, i) => (
            <p
              key={i}
              ref={(el) => {
                capRefs.current[i] = el;
              }}
              className="vr-cap"
            >
              {c}
            </p>
          ))}
        </div>
        <div ref={hintRef} className="vr-hint" aria-hidden>
          <span>{hint}</span>
          <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <div ref={blackRef} className="vr-black" aria-hidden />
        {/* the words of the page: always in the page (search engines, screen readers); shown on the screen while the scene loads or when it cannot run */}
        <div className="vr-words">
          <h1>{heading}</h1>
          <p>{text}</p>
        </div>
      </div>
    </section>
  );
}
