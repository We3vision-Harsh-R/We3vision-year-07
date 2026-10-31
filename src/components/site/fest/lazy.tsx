"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { FestConfig } from "@/lib/fest";
import { useFest } from "./use-fest";

// THE FESTIVAL IS LOADED ONLY WHERE AND WHEN IT IS NEEDED. Nothing of the festival is in the code of a page: every piece is its own chunk that
// the browser fetches only
//   - when a festival is on for the page (the layout renders LazyFestLayer only then), and only after the page has painted and the browser is
//     idle (the decorations then fade in), so the first screen and the content come first;
//   - for the road of the industries, the offices, the big menu and the car: only on the page that has that place, only when its switch is
//     on in Admin > Fest (useFest reads <html data-fest-fx>), and only when that place is drawn.
// With every festival off, nothing of this is downloaded at all. (Loaded with ssr: false: the decorations are pictures without content.)

const LayerChunk = dynamic(() => import("./fest-layer").then((m) => m.FestLayer), { ssr: false });
const RoadChunk = dynamic(() => import("./industries-fest").then((m) => m.RoadFest), { ssr: false });
const CarChunk = dynamic(() => import("./industries-fest").then((m) => m.CarFest), { ssr: false });
const OfficeChunk = dynamic(() => import("./office-fest").then((m) => m.OfficeFest), { ssr: false });
const MenuChunk = dynamic(() => import("./fest-menu").then((m) => m.FestMenuDecor), { ssr: false });
const ExploreChunk = dynamic(() => import("./fest-menu").then((m) => m.FestMenuExplore), { ssr: false });

/** the decorations of the whole site: fetched when the browser is idle after the first paint */
export function LazyFestLayer({ cfg }: { cfg: FestConfig }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    const start = () => setGo(true);
    const h = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 2000 }) : window.setTimeout(start, 600);
    return () => {
      if (w.requestIdleCallback) w.cancelIdleCallback?.(h);
      else window.clearTimeout(h);
    };
  }, []);
  return go ? <LayerChunk cfg={cfg} /> : null;
}

/** the decorations of the road of the industries (only the effects that are on) */
export const LazyRoadFest = RoadChunk;

/** the festive car: only when its switch is on */
export function LazyCarFest() {
  return useFest()?.has("ind-car") ? <CarChunk /> : null;
}

/** Diwali in an office (About / Team): only when its switch is on */
export function LazyOfficeFest({ effect }: { effect: "about" | "team" | "metaverse" }) {
  return useFest()?.has(effect) ? <OfficeChunk effect={effect} /> : null;
}

/** the toran, kandils and sparks of the big menu: only when its switch is on */
export function LazyFestMenu() {
  return useFest()?.has("menu") ? <MenuChunk /> : null;
}

/** the crackers couple and the hanging kandils in the empty place of the Explore row of the big menu: with the menu switch (the people with their own switch) */
export function LazyMenuExplore() {
  const fest = useFest();
  return fest?.has("menu") ? <ExploreChunk people={fest.has("menu-people")} /> : null;
}
