"use client";

import { useEffect, useRef } from "react";

/** Fades/slides content in when it scrolls into view. Only hides content that is below the fold, and only when JS runs. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already visible
    el.dataset.reveal = "hidden";
    // A tall block (a pinned strip is several screens high) can never be 12% inside the screen, so it counts as seen when a good part of the screen
    // shows it, whatever its own height: it must never stay hidden.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const seen = entry.isIntersecting && (entry.intersectionRatio >= 0.12 || entry.intersectionRect.height >= window.innerHeight * 0.3);
        if (seen) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { threshold: [0, 0.05, 0.12], rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}
