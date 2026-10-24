"use client";

import { useEffect, useRef, useState } from "react";
import { anyFest, cleanFest, type FestConfig } from "@/lib/fest";
import { LazyFestLayer } from "./lazy";

// A CHANGE IN ADMIN > FEST SHOWS ON THE OPEN WEBSITE WITHOUT A RELOAD (owner, 2026-10-24). This tiny piece is always on the laptop site; it
// holds the festival settings of the page and keeps them fresh:
//   - at once when the admin panel saves in the same browser (it says so on the channel "we3-fest", see components/admin/fest-manager.tsx);
//   - otherwise it asks /api/fest every 10 seconds while the tab is on the screen, and at once when the visitor comes back to the tab.
// The festival layer (lazy.tsx -> fest-layer.tsx) is loaded only once a festival is on; it then follows every change (switches on <html>,
// effects, density) and takes everything away when the festival is switched off.
export const FEST_CHANNEL = "we3-fest";
const EVERY_MS = 10000;

export function FestLive({ initial, force = false }: { initial: FestConfig; force?: boolean }) {
  const [cfg, setCfg] = useState(initial);
  const [loaded, setLoaded] = useState(force || anyFest(initial)); // once the layer is there it stays (it switches itself off)
  const last = useRef(JSON.stringify(initial));

  useEffect(() => {
    const take = (raw: unknown) => {
      const next = cleanFest(raw);
      const key = JSON.stringify(next);
      if (key === last.current) return;
      last.current = key;
      setCfg(next);
      if (anyFest(next)) setLoaded(true);
    };
    let busy = false;
    const ask = async () => {
      if (busy || document.hidden) return;
      busy = true;
      try {
        const r = await fetch("/api/fest", { cache: "no-store" });
        if (r.ok) take(await r.json());
      } catch {
        // offline for a moment: the next check tries again
      } finally {
        busy = false;
      }
    };
    const ch = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(FEST_CHANNEL) : null;
    if (ch) ch.onmessage = (e) => take(e.data);
    const timer = window.setInterval(ask, EVERY_MS);
    const onShow = () => {
      if (!document.hidden) void ask();
    };
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      ch?.close();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, []);

  return loaded ? <LazyFestLayer cfg={cfg} /> : null;
}
