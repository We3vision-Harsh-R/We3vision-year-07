"use client";

import { useEffect, useRef } from "react";

// The railway of /careers on a phone, in micro design: one thin line down the left edge of the screen with a small dot for every part of the page
// (the stations) and a tiny train that rides down the line as the page is read. A station lights up when the train has passed it. Pure decoration
// (aria-hidden, no clicks); the laptop page has the big railway (career/railway.tsx). CSS: (m)/m/careers/page.css (mp-car-rail).

const TRAIN_H = 34;

export function CareersRail() {
  const box = useRef<HTMLDivElement>(null);
  const train = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = box.current;
    const tr = train.current;
    if (!el || !tr) return;
    const root = el.closest(".ma-root") ?? document;
    let stops: { y: number; dot: HTMLElement }[] = [];
    let raf = 0;
    const build = () => {
      el.querySelectorAll(".mp-car-st").forEach((n) => n.remove());
      const doc = Math.max(1, document.documentElement.scrollHeight);
      const h = el.clientHeight;
      stops = Array.from(root.querySelectorAll<HTMLElement>(".mp-car-hero, .ma-sec")).map((s) => {
        const dot = document.createElement("i");
        dot.className = "mp-car-st";
        const y = ((s.getBoundingClientRect().top + window.scrollY) / doc) * h;
        dot.style.top = `${Math.min(h - 6, Math.max(0, y))}px`;
        el.appendChild(dot);
        return { y: s.getBoundingClientRect().top + window.scrollY, dot };
      });
    };
    const tick = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      tr.style.transform = `translate3d(0, ${p * (el.clientHeight - TRAIN_H)}px, 0)`;
      const mid = window.scrollY + window.innerHeight * 0.4;
      for (const s of stops) s.dot.dataset.on = s.y <= mid ? "1" : "0";
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const redo = () => {
      build();
      queue();
    };
    redo();
    const late = window.setTimeout(redo, 900); // the images and the fonts have moved the sections
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", redo);
    return () => {
      window.clearTimeout(late);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", redo);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={box} className="mp-car-rail" aria-hidden="true">
      <span ref={train} className="mp-car-rt">
        <TrainArt vertical />
      </span>
    </div>
  );
}

/** the little train, seen from above: an engine and two coaches (one thin line each, no detail) */
export function TrainArt({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <svg viewBox="0 0 10 34" width="10" height={TRAIN_H} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="1.5" y="1" width="7" height="9" rx="2" />
      <rect x="1.5" y="12" width="7" height="9" rx="2" />
      <path d="M1.5 23h7v6a4 4 0 0 1-7 0z" fill="currentColor" fillOpacity=".35" />
    </svg>
  ) : (
    <svg viewBox="0 0 34 10" width={TRAIN_H} height="10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="1" y="1.5" width="9" height="7" rx="2" />
      <rect x="12" y="1.5" width="9" height="7" rx="2" />
      <path d="M23 1.5h6a4 4 0 0 1 0 7h-6z" fill="currentColor" fillOpacity=".35" />
    </svg>
  );
}
