"use client";

import { useEffect, useRef } from "react";

// The scroll bar of the whole site: a frosted-glass thumb (blur + colour of the theme, like the menu) that floats at the right edge. It
// is faint at rest, wakes up while the page scrolls or the pointer is near it, can be dragged, and a click on the track jumps there.
// The native bar is hidden only while this one is mounted, and only for a mouse (a touch screen keeps its own thin overlay bar).
export function SiteScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-sb");

    let raf = 0;
    let idle = 0;
    let dragging = false;
    const lenis = () => (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    const metrics = () => {
      const vh = window.innerHeight;
      const doc = Math.max(root.scrollHeight, document.body.scrollHeight);
      const trackH = track.clientHeight;
      const max = Math.max(1, doc - vh);
      const h = Math.min(trackH, Math.max(52, (vh / doc) * trackH));
      return { vh, doc, trackH, max, h };
    };
    const paint = () => {
      raf = 0;
      const { doc, vh, trackH, max, h } = metrics();
      track.dataset.hide = doc <= vh + 4 ? "true" : "false";
      const y = Math.min(1, Math.max(0, window.scrollY / max));
      thumb.style.height = `${h}px`;
      thumb.style.transform = `translateY(${(y * (trackH - h)).toFixed(1)}px)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const wake = () => {
      track.dataset.on = "true";
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (!dragging) track.dataset.on = "false";
      }, 1100);
    };
    const onScroll = () => {
      schedule();
      wake();
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      const { max, trackH, h } = metrics();
      const startY = e.clientY;
      const startScroll = window.scrollY;
      dragging = true;
      track.dataset.drag = "true";
      thumb.setPointerCapture(e.pointerId);
      const move = (ev: PointerEvent) => {
        const to = Math.min(max, Math.max(0, startScroll + ((ev.clientY - startY) * max) / Math.max(1, trackH - h)));
        const l = lenis();
        if (l) l.scrollTo(to, { immediate: true, force: true });
        else window.scrollTo(0, to);
      };
      const up = () => {
        dragging = false;
        track.dataset.drag = "false";
        thumb.removeEventListener("pointermove", move);
        thumb.removeEventListener("pointerup", up);
        thumb.removeEventListener("pointercancel", up);
        wake();
      };
      thumb.addEventListener("pointermove", move);
      thumb.addEventListener("pointerup", up);
      thumb.addEventListener("pointercancel", up);
    };
    const onTrack = (e: PointerEvent) => {
      if (e.target === thumb) return;
      const { max, trackH, h } = metrics();
      const r = track.getBoundingClientRect();
      const to = Math.min(max, Math.max(0, ((e.clientY - r.top - h / 2) / Math.max(1, trackH - h)) * max));
      const l = lenis();
      if (l) l.scrollTo(to, { duration: 0.9 });
      else window.scrollTo({ top: to, behavior: "smooth" });
    };

    thumb.addEventListener("pointerdown", onDown);
    track.addEventListener("pointerdown", onTrack);
    track.addEventListener("pointerenter", wake);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    paint();
    return () => {
      root.classList.remove("has-sb");
      thumb.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointerdown", onTrack);
      track.removeEventListener("pointerenter", wake);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      window.clearTimeout(idle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={trackRef} className="sb-track" data-on="false" data-drag="false" data-hide="true" aria-hidden>
      <div ref={thumbRef} className="sb-thumb" />
    </div>
  );
}
