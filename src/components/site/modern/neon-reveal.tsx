"use client";

import { useEffect, useRef } from "react";

// "Neon Reveal": a neon tube that flickers on and lights up the content under it (the idea is the Neon Reveal of React Bits Pro, built
// here without any library). When the block scrolls into view the tube ignites with a short flicker, then it hums quietly while its light
// falls over the content and uncovers it from the tube downwards (the edge of the reveal is soft). Nothing is hidden when JavaScript does
// not run or when the visitor prefers less motion: the content is simply there. The effect is plain CSS (a registered custom property that
// is animated), so it costs nothing while it rests. The look is in globals.css (.nr-*).

export function NeonReveal({
  children,
  className = "",
  delay = 0,
  duration = 1.8,
  width = "72%",
}: {
  children: React.ReactNode;
  className?: string;
  /** seconds before the tube ignites once the block is in view */
  delay?: number;
  /** seconds the light needs to uncover the content */
  duration?: number;
  /** length of the tube (a CSS width) */
  width?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.nr = "on";
      return;
    }
    // below the fold: wait; already on the screen: play at once
    el.dataset.nr = "wait";
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.nr = "on";
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`nr ${className}`} style={{ "--nr-delay": `${delay}s`, "--nr-dur": `${duration}s`, "--nr-w": width } as React.CSSProperties}>
      <span className="nr-tube" aria-hidden />
      <span className="nr-spill" aria-hidden />
      <div className="nr-body">{children}</div>
    </div>
  );
}
