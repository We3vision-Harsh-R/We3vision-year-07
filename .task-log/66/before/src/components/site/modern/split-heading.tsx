"use client";

import { useEffect, useRef } from "react";

// A heading whose words come in one after the other (the idea is the Split Text of React Bits, built here without a library): every word
// rises out of a blur when the heading scrolls into view, the next one a moment later. The words are real text in the page (nothing is
// hidden from Google or from screen readers) and nothing is hidden at all when JavaScript does not run or the visitor prefers less motion.
// The look is in globals.css (.sh-*).

export function SplitHeading({ text, className = "", as: Tag = "h2" }: { text: string; className?: string; as?: "h1" | "h2" | "h3" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.sh = "wait";
    const show = () => {
      el.dataset.sh = "in";
      io.disconnect();
      window.removeEventListener("scroll", past);
    };
    // a jump (an anchor link) can take the visitor past the heading without it ever being seen: then it is shown at once
    const past = () => {
      if (el.getBoundingClientRect().bottom < 0) show();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) show();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    window.addEventListener("scroll", past, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", past);
    };
  }, []);
  const lines = text.split("\n");
  let k = 0;
  return (
    <Tag ref={ref} className={`sh ${className}`}>
      {lines.map((line, li) => (
        <span key={li} className="sh-line" data-l={li === 0 ? "a" : "b"}>
          {line
            .split(" ")
            .filter(Boolean)
            .map((w, wi) => (
              <span key={wi} className="sh-word" style={{ "--i": k++ } as React.CSSProperties}>
                {w}
              </span>
            ))}
        </span>
      ))}
    </Tag>
  );
}
