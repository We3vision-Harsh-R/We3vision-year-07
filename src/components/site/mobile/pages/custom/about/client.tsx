"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/** the interactive part of /about: the story player with Pando */

/** Pando, the panda of the laptop island, drawn with shapes; his eyes look the way the story moves */
export function Pando({ look = 0, size = "md" }: { look?: -1 | 0 | 1; size?: "sm" | "md" }) {
  return (
    <span className={`mp-about-pando is-${size}`} data-look={look} aria-hidden="true">
      <i className="mp-about-pe is-l" />
      <i className="mp-about-pe is-r" />
      <i className="mp-about-pf">
        <i className="mp-about-pp is-l">
          <i />
        </i>
        <i className="mp-about-pp is-r">
          <i />
        </i>
        <i className="mp-about-pn" />
      </i>
    </span>
  );
}

/**
 * "Our Story" as a story player: the bars on top show where you are, a tap on the right half (or a swipe to the left, or the arrow keys)
 * goes on, the left half goes back. Each chapter swaps in with a soft crossfade and Pando hops along.
 */
export function StoryPlayer({ chapters, label }: { chapters: { title: string; text: string }[]; label: string }) {
  const [k, setK] = useState(0);
  const [dir, setDir] = useState<-1 | 0 | 1>(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const n = chapters.length;
  const go = (j: number) => {
    const t = Math.max(0, Math.min(n - 1, j));
    if (t === k) return;
    setDir(t > k ? 1 : -1);
    setK(t);
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) return go(dx < 0 ? k + 1 : k - 1);
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      const r = e.currentTarget.getBoundingClientRect();
      go(e.clientX - r.left > r.width * 0.35 ? k + 1 : k - 1);
    }
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(k + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(k - 1); }
  };
  if (n === 0) return null;
  const c = chapters[k];
  return (
    <div className="mp-about-player" role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="mp-about-bars" aria-hidden="true">
        {chapters.map((_, i) => (
          <i key={i} className={i < k ? "is-done" : i === k ? "is-now" : undefined} />
        ))}
      </div>
      <div className="mp-about-stage" tabIndex={0} onPointerDown={down} onPointerUp={up} onPointerCancel={() => (start.current = null)} onKeyDown={key}>
        <span key={`p${k}`} className="mp-about-hop">
          <Pando look={dir} />
        </span>
        <div key={k} className="mp-about-slide" aria-live="polite">
          <p className="mp-about-no">
            {k + 1} / {n}
          </p>
          <h3>{c.title}</h3>
          <p className="mp-about-txt">{c.text}</p>
        </div>
      </div>
      <div className="mp-about-ctl">
        <button type="button" className="mp-about-rb" aria-label="Previous chapter" disabled={k === 0} onClick={() => go(k - 1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="mp-about-dots" role="tablist" aria-label={label}>
          {chapters.map((x, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === k} aria-label={x.title} className={i === k ? "is-on" : undefined} onClick={() => go(i)} />
          ))}
        </div>
        <button type="button" className="mp-about-rb" aria-label="Next chapter" disabled={k === n - 1} onClick={() => go(k + 1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}
