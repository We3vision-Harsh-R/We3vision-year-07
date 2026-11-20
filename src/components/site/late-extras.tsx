"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { PickerConfig } from "./theme-picker";

import { WINTER_ON } from "@/lib/winter"; // the winter master switch
import { GTA_ON } from "@/lib/gta"; // the GTA theme master switch (seven-star scroll progress)
import { CHAT_FULL_ON } from "@/lib/chat-overlay"; // the full-screen chat (task 160)

/**
 * The extras that are not needed to see and use the first screen: the custom mouse cursor, the colour picker and the pause of off-screen
 * figures. Their code is a separate chunk that the browser fetches when it is idle, right after the first paint, instead of with every page.
 * `picker` is what Admin > Settings > "Colour picker" says (when the card opens, which colours).
 */
export function LateExtras({ picker }: { picker?: PickerConfig }) {
  const [parts, setParts] = useState<{ Cursor: ComponentType; Theme: ComponentType<{ config?: PickerConfig }>; Pause: ComponentType; Presence: ComponentType; Winter: ComponentType | null; Gta: ComponentType | null; Chat: ComponentType | null } | null>(null);
  useEffect(() => {
    let off = false;
    const load = () => {
      // the winter snow (task 152, preview): its own chunk, only fetched while WINTER_ON is true
      const winter = WINTER_ON ? import("./winter-snow").then((m) => m.WinterSnow) : Promise.resolve(null);
      // the seven stars of the GTA theme (task 156): own chunk, only fetched while GTA_ON is true
      // (task 162: the GTA theme and the full-screen chat are for laptop and desktop screens only, so phones and tablets do not even fetch them)
      const desk = window.matchMedia("(min-width: 1024px)").matches;
      const gta = GTA_ON && desk ? import("./gta-stars").then((m) => m.GtaStars) : Promise.resolve(null);
      // the full-screen chat (task 160): every chat box of the site opens its conversation in it
      const chat = CHAT_FULL_ON && desk ? import("./chat-overlay").then((m) => m.ChatOverlay) : Promise.resolve(null);
      void Promise.all([import("./custom-cursor"), import("./theme-picker"), import("./pause-offscreen"), import("./presence"), winter, gta, chat]).then(([cursor, theme, pause, presence, Winter, Gta, Chat]) => {
        if (!off) setParts({ Cursor: cursor.CustomCursor, Theme: theme.ThemeProvider, Pause: pause.PauseOffscreen, Presence: presence.PresenceLive, Winter, Gta, Chat });
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
  const { Cursor, Theme, Pause, Presence, Winter, Gta, Chat } = parts;
  return (
    <>
      <Cursor />
      <Theme config={picker} />
      <Pause />
      <Presence />
      {Winter && <Winter />}
      {Gta && <Gta />}
      {Chat && <Chat />}
    </>
  );
}
