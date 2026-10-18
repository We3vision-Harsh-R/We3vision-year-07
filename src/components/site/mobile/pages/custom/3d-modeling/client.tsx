"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";

/** writes the turn into two CSS variables (no React render per frame) */
function draw(el: HTMLElement | null, r: { x: number; y: number }) {
  if (!el) return;
  el.style.setProperty("--rx", `${r.x}deg`);
  el.style.setProperty("--ry", `${r.y}deg`);
}

/**
 * The 3D stage of /3d-modeling: a glass turntable with a cube (CSS 3D, transform only, no engine). It turns slowly on its own until you touch it;
 * drag sideways to turn it (vertical swipes still scroll the page), or focus it and use the arrow keys. Paused when off screen and for reduced motion.
 * `label` is the page title from the CMS (for screen readers).
 */
export function Turntable({ label }: { label: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const rot = useRef({ x: -20, y: 35 });
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const idle = useRef(true);

  const paint = () => draw(stage.current, rot.current);

  useEffect(() => {
    draw(stage.current, rot.current);
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    let seen = true;
    const tick = (now: number) => {
      if (last && idle.current) {
        rot.current.y += Math.min(now - last, 50) * 0.018;
        draw(el, rot.current);
      }
      last = now;
      raf = seen ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const down = (e: PointerEvent<HTMLDivElement>) => {
    idle.current = false;
    drag.current = { px: e.clientX, py: e.clientY, x: rot.current.x, y: rot.current.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.classList.add("is-grab");
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    rot.current.y = d.y + (e.clientX - d.px) * 0.6;
    rot.current.x = Math.max(-60, Math.min(60, d.x - (e.clientY - d.py) * 0.4));
    paint();
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    e.currentTarget.classList.remove("is-grab");
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: [0, -15], ArrowRight: [0, 15], ArrowUp: [10, 0], ArrowDown: [-10, 0] }[e.key];
    if (!step) return;
    e.preventDefault();
    idle.current = false;
    rot.current.x = Math.max(-60, Math.min(60, rot.current.x + step[0]));
    rot.current.y += step[1];
    paint();
  };

  return (
    <div
      ref={stage}
      className="mp-3d-stage mp-3d-glass"
      role="img"
      aria-label={label}
      tabIndex={0}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={key}
    >
      <span className="mp-3d-floor" aria-hidden="true" />
      <span className="mp-3d-cube" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
