"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

type Place = { lat: number; lng: number };

/** The earth turns to a country, a line of light travels there from the first place (our head office) and the place lights up (see ReachPlaces). */
export const REACH_EVENT = "we3-reach-active";

const DEG = Math.PI / 180;
const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;
const wrapPi = (d: number) => ((((d + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
/** the angle the globe has to be turned to (phi) to show a longitude in the middle */
const phiOf = (lng: number) => 1.5 * Math.PI - lng * DEG;

const STEP = 2600; // ms for every country: the globe turns, the line of light travels, the place lights up
const OVERVIEW = 4200; // ms at the end when all the lines are on the globe and it turns slowly

/**
 * Dotted rotating earth (WebGL, ~5 KB library). The first place is the head office: one after the other the globe turns to every other
 * place and a line of light travels there from the head office. In the end all the lines are on the globe for a while, then it starts again.
 * Visitors who prefer less motion get the globe standing still with all the lines on it.
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
    let t0 = performance.now();
    let last = t0;
    let shown = 0; // how many lines are on the globe
    let active = -1; // the country the globe is turning to
    let pulses: number[] = dest.map(() => 0);
    let lastPulse = 0;
    const announce = (i: number) => window.dispatchEvent(new CustomEvent(REACH_EVENT, { detail: i }));

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const total = dest.length * STEP + OVERVIEW;
      const t = (now - t0) % total;
      let targetPhi: number;
      let targetTheta = 0.3;
      let nextShown = shown;
      if (t < dest.length * STEP) {
        const i = Math.floor(t / STEP);
        const within = t - i * STEP;
        const d = dest[i];
        // the globe turns to the middle between the head office and the country (so that both are in view)
        const mid = origin.lng + wrap180(d.lng - origin.lng) / 2;
        targetPhi = phiOf(mid);
        targetTheta = Math.max(-0.15, Math.min(0.7, ((origin.lat + d.lat) / 2) * DEG * 0.8));
        if (i !== active) {
          active = i;
          announce(i);
          if (i === 0) {
            nextShown = 0;
            pulses = dest.map(() => 0);
          }
        }
        if (within > 650) nextShown = i + 1; // the line starts when the globe has nearly turned
        if (within > 1500 && pulses[i] === 0) pulses[i] = 1; // it arrives: the place lights up
      } else {
        // all the lines on the globe, turning slowly
        targetPhi = phi + 0.5 * dt * 0.7;
        targetTheta = 0.3;
        nextShown = dest.length;
        if (active !== -2) {
          active = -2;
          announce(-1);
        }
      }
      phi += wrapPi(targetPhi - phi) * (1 - Math.exp(-dt * 2.4));
      theta += (targetTheta - theta) * (1 - Math.exp(-dt * 2));
      const update: Parameters<typeof globe.update>[0] = { phi, theta };
      let pulsing = false;
      pulses = pulses.map((p) => {
        if (p <= 0.001) return p; // not lit (0), or finished (0.0001: it must not be lit again in this round)
        pulsing = true;
        const q = p - dt * 1.3;
        return q > 0.001 ? q : 0.0001;
      });
      if (nextShown !== shown) {
        shown = nextShown;
        update.arcs = dest.slice(0, shown).map(arcOf);
      }
      if (pulsing && now - lastPulse > 30) {
        lastPulse = now;
        update.markers = markersAt(pulses.map((p) => (p > 0.001 ? p : 0)));
      }
      globe.update(update);
    };
    frame = requestAnimationFrame(tick);
    t0 = performance.now();
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
