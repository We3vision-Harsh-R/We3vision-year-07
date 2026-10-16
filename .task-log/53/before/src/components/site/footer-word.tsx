"use client";

import { useRef } from "react";

// The big name at the bottom of the footer. It is drawn as an outline; where the mouse is, the letters are filled with light (a round window
// that follows the pointer). Without a mouse (a phone) a window of light slowly goes along the word by itself (CSS). Only two custom properties
// change while the pointer moves.
export function FooterWord({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
    el.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
    el.dataset.live = "true";
  };
  const leave = () => {
    if (ref.current) ref.current.dataset.live = "false";
  };
  return (
    <div ref={ref} className="ft-word" data-live="false" onPointerMove={move} onPointerLeave={leave} aria-hidden>
      <span className="ft-word-o">{text}</span>
      <span className="ft-word-f">{text}</span>
    </div>
  );
}

/** A round button that takes you back to the top of the page. */
export function ToTop() {
  return (
    <button
      type="button"
      className="ft-top"
      onClick={() => {
        const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
        if (lenis) lenis.scrollTo(0, { duration: 1.4 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <span>Back to top</span>
      <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
