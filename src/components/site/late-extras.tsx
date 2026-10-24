"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { PickerConfig } from "./theme-picker";

/**
 * The extras that are not needed to see and use the first screen: the custom mouse cursor, the colour picker and the pause of off-screen
 * figures. Their code is a separate chunk that the browser fetches when it is idle, right after the first paint, instead of with every page.
 * `picker` is what Admin > Settings > "Colour picker" says (when the card opens, which colours).
 */
export function LateExtras({ picker }: { picker?: PickerConfig }) {
  const [parts, setParts] = useState<{ Cursor: ComponentType; Theme: ComponentType<{ config?: PickerConfig }>; Pause: ComponentType } | null>(null);
  useEffect(() => {
    let off = false;
    const load = () => {
      void Promise.all([import("./custom-cursor"), import("./theme-picker"), import("./pause-offscreen")]).then(([cursor, theme, pause]) => {
        if (!off) setParts({ Cursor: cursor.CustomCursor, Theme: theme.ThemeProvider, Pause: pause.PauseOffscreen });
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
  if (!parts) return null;
  const { Cursor, Theme, Pause } = parts;
  return (
    <>
      <Cursor />
      <Theme config={picker} />
      <Pause />
    </>
  );
}
