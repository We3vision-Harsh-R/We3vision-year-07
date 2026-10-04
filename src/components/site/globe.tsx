"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

type Place = { lat: number; lng: number };

/** Dotted rotating earth (WebGL, ~5 KB library). Marks the given places and joins the first two with an arc. */
export function Globe({ places, label }: { places: Place[]; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.max(canvas.offsetWidth, 200) * dpr;
    const violet: [number, number, number] = [0.83, 0.53, 1];

    let globe: ReturnType<typeof createGlobe>;
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size,
        height: size,
        phi: 4.2,
        theta: 0.3,
        dark: 1,
        diffuse: 1.3,
        mapSamples: 16000,
        mapBrightness: 5,
        baseColor: [0.32, 0.14, 0.46],
        markerColor: violet,
        glowColor: [0.5, 0.18, 0.75],
        markers: places.map((p) => ({ location: [p.lat, p.lng] as [number, number], size: 0.07 })),
        arcs: places.length > 1 ? [{ from: [places[0].lat, places[0].lng], to: [places[1].lat, places[1].lng] }] : [],
        arcColor: violet,
        arcWidth: 0.5,
        arcHeight: 0.25,
      });
    } catch {
      return; // WebGL not available: the card still reads fine without the globe
    }

    let phi = 4.2;
    let frame = 0;
    let visible = true;
    const tick = () => {
      if (visible && !reduceMotion) {
        phi += 0.004;
        globe.update({ phi });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      globe.destroy();
    };
  }, [places]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className="aspect-square w-full max-w-[440px]" />;
}
