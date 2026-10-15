"use client";

import { useCallback, useEffect, useState } from "react";

// PINNED STAGE of the technology pages. The app window stays fixed on the screen while the visitor scrolls; every step of the scroll opens the
// next menu item / tab of the window (the "compulsory" scroll the owner likes). Clicking a menu item scrolls to its step. A box inside the window
// that has its own scroll (data-lenis-prevent) scrolls first; when it is at its end the wheel goes on to the page, so the window never traps the
// visitor.

const STEP = 70; // vh of scrolling per tab

type LenisLike = { scroll: number; scrollTo: (y: number, o?: { immediate?: boolean; force?: boolean; duration?: number }) => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

export function useStage(count: number) {
  const [outerEl, outer] = useState<HTMLDivElement | null>(null);
  const [innerEl, inner] = useState<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = outerEl;
    if (!el) return;
    const calc = () => {
      const slot = (window.innerHeight * STEP) / 100;
      const y = -el.getBoundingClientRect().top;
      setIndex(Math.max(0, Math.min(count - 1, Math.round(y / slot))));
    };
    calc();
    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, [count, outerEl]);

  useEffect(() => {
    const box = innerEl;
    if (!box) return;
    const onWheel = (e: WheelEvent) => {
      const l = lenis();
      if (!l || e.ctrlKey) return;
      let el = e.target as HTMLElement | null;
      while (el && el !== box) {
        if (el.hasAttribute("data-lenis-prevent")) {
          const room = e.deltaY < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1;
          if (room) return; // the box scrolls itself
          break;
        }
        el = el.parentElement;
      }
      if (el !== box && el) {
        // at the end of the box: pass the wheel on to the page
        e.preventDefault();
        e.stopPropagation();
        l.scrollTo(l.scroll + e.deltaY, { immediate: true, force: true });
      }
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => box.removeEventListener("wheel", onWheel);
  }, [innerEl]);

  const goto = useCallback((i: number) => {
    const el = outerEl;
    if (!el) return;
    const slot = (window.innerHeight * STEP) / 100;
    const y = window.scrollY + el.getBoundingClientRect().top + i * slot;
    setIndex(i);
    const l = lenis();
    if (l) l.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }, [outerEl]);

  return { setOuter: outer, setInner: inner, index, goto, style: { height: `calc(100vh + ${(count - 1) * STEP}vh)` } as React.CSSProperties };
}

/** The window of a pinned page: title bar, the tab list (a side menu, or a top strip, depending on the page's CSS) and the panel that scrolls. */
export function AppWindow({ p, title, tabs, index, onPick, children }: { p: string; title: string; tabs: string[]; index: number; onPick: (i: number) => void; children: React.ReactNode }) {
  return (
    <div className={`${p}-win tw`}>
      <div className="tw-bar"><i /><i /><i /><b>{title}</b></div>
      <div className="tw-body">
        <nav className="tw-nav" aria-label={title}>
          {tabs.map((t, i) => (
            <button key={t} type="button" className={i === index ? "is-on" : ""} onClick={() => onPick(i)}><span>{String(i + 1).padStart(2, "0")}</span>{t}</button>
          ))}
        </nav>
        <div className="tw-panel" key={index} data-lenis-prevent>{children}</div>
      </div>
    </div>
  );
}
