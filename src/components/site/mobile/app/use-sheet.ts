"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointer } from "react";

/**
 * The open / close life of a bottom sheet. `shown` keeps the sheet mounted while it animates out; `state` is "in" or "out" (CSS animates both);
 * while it is open the page behind does not scroll, Escape closes it and a pull down on the grabber closes it.
 */
export function useSheet(open: boolean, onClose: () => void) {
  const [was, setWas] = useState(open);
  const [leaving, setLeaving] = useState(false);
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  if (was !== open) {
    setWas(open);
    setLeaving(!open);
  }
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setLeaving(false), 260);
    return () => window.clearTimeout(t);
  }, [leaving]);
  const shown = open || leaving;

  useEffect(() => {
    if (!shown) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", key);
    return () => {
      html.style.overflow = before;
      window.removeEventListener("keydown", key);
    };
  }, [shown, onClose]);

  const grab = {
    onPointerDown: (e: ReactPointer<HTMLElement>) => {
      start.current = e.clientY;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    },
    onPointerMove: (e: ReactPointer<HTMLElement>) => {
      if (start.current === null) return;
      setDrag(Math.max(0, e.clientY - start.current));
    },
    onPointerUp: () => {
      if (start.current === null) return;
      const far = drag > 90;
      start.current = null;
      setDrag(0);
      if (far) onClose();
    },
    onPointerCancel: () => {
      start.current = null;
      setDrag(0);
    },
  };

  return { shown, state: open ? "in" : "out", drag, grab };
}
