"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { PickerConfig } from "./theme-picker";

import { WINTER_ON } from "@/lib/winter"; // the winter master switch
import { CHAT_FULL_ON } from "@/lib/chat-overlay"; // the full-screen chat (task 160)
import { isLite, sniffSlow, watchHidden } from "@/lib/lite"; // light mode for weak laptops (see lib/lite.ts)

/**
 * The extras that are not needed to see and use the first screen: the custom mouse cursor, the colour picker and the pause of off-screen
 * figures. Their code is a separate chunk that the browser fetches when it is idle, right after the first paint, instead of with every page.
 * `picker` is what Admin > Settings > "Colour picker" says (when the card opens, which colours).
 */
export function LateExtras({ picker }: { picker?: PickerConfig }) {
  const [parts, setParts] = useState<{ Cursor: ComponentType; Theme: ComponentType<{ config?: PickerConfig }>; Pause: ComponentType; Presence: ComponentType; Winter: ComponentType | null; Chat: ComponentType | null; Fx: ComponentType } | null>(null);
  const [lite, setLite] = useState(false);
  useEffect(() => {
    let off = false;
    const stop = [watchHidden(), sniffSlow(() => setLite(true))];
    const load = () => {
      setLite(isLite());
      // the winter snow (task 152, preview): its own chunk, only fetched while WINTER_ON is true
      const winter = WINTER_ON && !isLite() ? import("./winter-snow").then((m) => m.WinterSnow) : Promise.resolve(null);
      // (task 162: the full-screen chat is for laptop and desktop screens only, so phones and tablets do not even fetch it)
            const desk = window.matchMedia("(min-width: 1024px)").matches;
      // the full-screen chat (task 160): every chat box of the site opens its conversation in it
      const chat = CHAT_FULL_ON && desk ? import("./chat-overlay").then((m) => m.ChatOverlay) : Promise.resolve(null);
      void Promise.all([import("./custom-cursor"), import("./theme-picker"), import("./pause-offscreen"), import("./presence"), winter, chat, import("./page-fx")]).then(([cursor, theme, pause, presence, Winter, Chat, fx]) => {
        if (!off) setParts({ Cursor: cursor.CustomCursor, Theme: theme.ThemeProvider, Pause: pause.PauseOffscreen, Presence: presence.PresenceLive, Winter, Chat, Fx: fx.PageFx });
      });
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    const handle = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 1500 }) : window.setTimeout(load, 400);
    return () => {
      off = true;
      stop.forEach((f) => f());
      if (w.requestIdleCallback) w.cancelIdleCallback?.(handle);
      else window.clearTimeout(handle);
    };
  }, []);
  if (!parts) return null;
  const { Cursor, Theme, Pause, Presence, Winter, Chat, Fx } = parts;
  return (
    <>
      {!lite && <Cursor />}
      <Theme config={picker} />
      <Pause />
      <Presence />
      <Fx />
      {Winter && !lite && <Winter />}
      {Chat && <Chat />}
    </>
  );
}
