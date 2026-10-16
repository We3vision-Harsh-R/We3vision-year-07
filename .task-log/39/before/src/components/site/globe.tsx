"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

type Place = { lat: number; lng: number };

/** The place that is lit now (an index among the countries, -1 = none): the lines go out from the head office to all of them (see ReachPlaces). */
export const REACH_EVENT = "we3-reach-active";

const DEG = Math.PI / 180;
const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;
/** the angle the globe has to be turned to (phi) to show a longitude in the middle */
const phiOf = (lng: number) => 1.5 * Math.PI - lng * DEG;

const DRAW = 380; // ms between the lines when they go out from the head office, one after the other, at the start
const WAVE = 520; // ms between the countries that light up one after the other (a wave that goes round all of them, again and again)
const SPIN = 0.16; // how fast the globe turns (radians per second)

/**
 * Dotted rotating earth (WebGL, ~5 KB library). The first place is the head office: at the start the lines go out from it to every other
 * place, one after the other, and then they all stay on the globe while it turns slowly, so that you can see that the work goes all over the
 * world. The countries light up one after the other (a wave) in step with the names next to the globe. Visitors who prefer less motion get
 * the globe standing still with all the lines on it.
 */
export function Globe({ places, label }: { places: Place[]; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || places.length === 0) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.max(canvas.offsetWidth, 200) * dpr;
    const violet: [number, number, number] = [0.83, 0.53, 1];
    const gold: [number, number, number] = [1, 0.86, 0.6];
    const origin = places[0];
    const dest = places.slice(1);
    const arcOf = (p: Place) => ({ from: [origin.lat, origin.lng] as [number, number], to: [p.lat, p.lng] as [number, number] });
    const markersAt = (pulse: number[]) =>
      places.map((p, i) => ({
        location: [p.lat, p.lng] as [number, number],
        size: i === 0 ? 0.1 : 0.06 + 0.08 * (pulse[i - 1] ?? 0),
        color: i === 0 ? gold : violet,
      }));

    let phi = phiOf(origin.lng);
    let theta = 0.3;
    let globe: ReturnType<typeof createGlobe>;
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size,
        height: size,
        phi,
        theta,
        dark: 1,
        diffuse: 1.3,
        mapSamples: 16000,
        mapBrightness: 5,
        baseColor: [0.32, 0.14, 0.46],
        markerColor: violet,
        glowColor: [0.5, 0.18, 0.75],
        markers: markersAt([]),
        arcs: reduceMotion ? dest.map(arcOf) : [],
        arcColor: violet,
        arcWidth: 0.5,
        arcHeight: 0.25,
      });
    } catch {
      return; // WebGL not available: the card still reads fine without the globe
    }
    if (reduceMotion || dest.length === 0) {
      globe.update({ phi: phiOf(origin.lng + (dest[0] ? wrap180(dest[0].lng - origin.lng) / 2 : 0)), theta: 0.3 });
      return () => globe.destroy();
    }

    let frame = 0;
    let visible = true;
    let last = performance.now();
    const start = last;
    let shown = 0; // how many lines are on the globe
    let waveAt = -1; // the country lit now
    const pulse: number[] = dest.map(() => 0);
    const announce = (i: number) => window.dispatchEvent(new CustomEvent(REACH_EVENT, { detail: i }));
    // the globe starts turned to the head office, a little towards the countries on the west side of it (so that many lines are in view)
    phi = phiOf(origin.lng);

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = now - start;
      phi += SPIN * dt;
      theta += (0.3 - theta) * (1 - Math.exp(-dt * 2));
      const update: Parameters<typeof globe.update>[0] = { phi, theta };
      // the lines go out from the head office one after the other, then they all stay
      const want = Math.min(dest.length, Math.floor(t / DRAW) + 1);
      if (want !== shown) {
        shown = want;
        update.arcs = dest.slice(0, shown).map(arcOf);
      }
      // a wave of light goes round the countries (when all the lines are out)
      let changed = false;
      if (shown === dest.length) {
        const k = Math.floor((t - dest.length * DRAW) / WAVE) % dest.length;
        if (k >= 0 && k !== waveAt) {
          waveAt = k;
          pulse[k] = 1;
          announce(k);
          changed = true;
        }
      }
      for (let i = 0; i < pulse.length; i++) {
        if (pulse[i] > 0) {
          pulse[i] = Math.max(0, pulse[i] - dt * 1.4);
          changed = true;
        }
      }
      if (changed) update.markers = markersAt(pulse);
      globe.update(update);
    };
    frame = requestAnimationFrame(tick);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      globe.destroy();
    };
  }, [places]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className="aspect-square w-full max-w-[440px]" />;
}
