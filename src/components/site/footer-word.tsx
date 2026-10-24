"use client";

import { useEffect, useRef } from "react";

// The big name at the bottom of the footer. It is drawn as an outline; where the mouse is, the letters are filled with light (a round window
// that follows the pointer). Without a mouse (a phone) a window of light slowly goes along the word by itself (CSS). Only two custom properties
// change while the pointer moves.
// The size follows the number of letters (the CSS: --chars), and a measurement makes sure the whole name always fits the width of the window,
// whatever the name is and however wide the window (the name "We3vision Private Limited" is much longer than "We3vision").
export function FooterWord({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const line = el?.querySelector<HTMLElement>(".ft-word-o");
    if (!el || !line) return;
    const fit = () => {
      el.style.fontSize = ""; // back to the size of the CSS, then measure
      const room = el.clientWidth;
      const need = line.scrollWidth;
      if (room > 0 && need > room) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * room * 0.985) / need}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    void document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [text]);
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
    <div ref={ref} className="ft-word" data-live="false" style={{ "--chars": Math.max(text.length, 4) } as React.CSSProperties} onPointerMove={move} onPointerLeave={leave} aria-hidden>
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
