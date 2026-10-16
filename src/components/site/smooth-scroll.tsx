"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Buttery smooth scrolling (Lenis). Skipped for visitors who prefer reduced motion. The library (about 11 KB) is loaded when the browser is idle, after the first paint. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: Lenis | undefined;
    let frame = 0;
    let stopped = false;
    const start = () => {
      void import("lenis").then(({ default: LenisClass }) => {
        if (stopped) return;
        lenis = new LenisClass({ lerp: 0.1, anchors: true });
        (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
        frame = requestAnimationFrame(function raf(time) {
          lenis?.raf(time);
          frame = requestAnimationFrame(raf);
        });
      });
    };
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const handle = idle ? idle(start, { timeout: 1500 }) : window.setTimeout(start, 400);
    return () => {
      stopped = true;
      if (!idle) window.clearTimeout(handle);
      else (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(handle);
      cancelAnimationFrame(frame);
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      lenis?.destroy();
    };
  }, []);
  return null;
}
