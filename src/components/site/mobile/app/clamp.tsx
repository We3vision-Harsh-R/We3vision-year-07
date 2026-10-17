"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Long content, short on the screen: only the first `lines` lines (or `max`, a CSS height, for things that are not text) are shown, fading out, with a
 * "Read more" button. Everything stays in the page (search engines and screen readers read it all); the button opens it with a smooth height change.
 * When the content is short enough nothing is clamped and no button is shown. Before the script runs the content is already clamped (no jump).
 */
export function Clamp({ children, lines = 4, max, more = "Read more", less = "Show less", className, fade, slack }: { children: ReactNode; lines?: number; max?: string; more?: string; less?: string; className?: string; fade?: string; slack?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<{ over: boolean; full: number } | null>(null); // null = not measured yet

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const h = el.scrollHeight;
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 26;
      const limit = max ? parseFloat(max) : lines * lh;
      setState({ over: h > limit + (slack ?? lh * 0.6), full: h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const c of Array.from(el.children)) ro.observe(c);
    return () => ro.disconnect();
  }, [lines, max, slack]);

  const closed = max ?? `calc(${lines} * 1.7em)`;
  const clamped = state === null || state.over;
  const maxHeight = !clamped ? undefined : open && state ? state.full : closed;
  return (
    <div className={`ma-clampw${className ? ` ${className}` : ""}`}>
      <div ref={box} className={`ma-clamp${clamped && !open ? " is-cut" : ""}`} style={{ maxHeight, ...(fade ? { ["--fade" as string]: fade } : {}) }}>
        {children}
      </div>
      {state?.over && (
        <button type="button" className="ma-more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? less : more}
        </button>
      )}
    </div>
  );
}
