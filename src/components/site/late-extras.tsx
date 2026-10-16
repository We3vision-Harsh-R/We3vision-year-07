"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * The extras that are not needed to see and use the first screen: the custom mouse cursor, the colour picker and the pause of off-screen
 * figures. Their code is a separate chunk that the browser fetches when it is idle, right after the first paint, instead of with every page.
 */
export function LateExtras() {
  const [parts, setParts] = useState<ComponentType[]>([]);
  useEffect(() => {
    let off = false;
    const load = () => {
      void Promise.all([import("./custom-cursor"), import("./theme-picker"), import("./pause-offscreen")]).then(([cursor, theme, pause]) => {
        if (!off) setParts([cursor.CustomCursor, theme.ThemeProvider, pause.PauseOffscreen]);
      });
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    const handle = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 1500 }) : window.setTimeout(load, 400);
    return () => {
      off = true;
      if (w.requestIdleCallback) w.cancelIdleCallback?.(handle);
      else window.clearTimeout(handle);
    };
  }, []);
  return (
    <>
      {parts.map((Part, i) => (
        <Part key={i} />
      ))}
    </>
  );
}
