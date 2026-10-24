"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { FestDensity, FestEffect } from "@/lib/fest";

// What the festival of the current page is, read from <html data-fest data-fest-fx data-fest-density> (the boot script and FestLayer keep them
// right). Any part of the site (the big menu, the logo ground, the offices, the road of the industries) can use it: it re-renders when the
// attributes change, and renders nothing festive on the server (the first paint is the normal theme until the attributes say otherwise).

const KEY = ["data-fest", "data-fest-fx", "data-fest-density"] as const;

const read = () => {
  const h = document.documentElement;
  return KEY.map((k) => h.getAttribute(k) ?? "").join("|");
};
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: [...KEY] });
  return () => mo.disconnect();
};

export type FestNow = { id: string; fx: ReadonlySet<string>; density: FestDensity; has: (k: FestEffect) => boolean } | null;

export function useFest(): FestNow {
  const raw = useSyncExternalStore(subscribe, read, () => "||");
  return useMemo(() => {
    const [id, fx, density] = raw.split("|");
    if (!id) return null;
    const set = new Set(fx.split(" ").filter(Boolean));
    return { id, fx: set, density: (density === "low" || density === "rich" ? density : "normal") as FestDensity, has: (k: FestEffect) => set.has(k) };
  }, [raw]);
}
