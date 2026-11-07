"use client";

import { useSyncExternalStore } from "react";

// "12 live on the website": the number comes from the presence poll (components/site/presence.tsx), which says it with a window event.
const subscribe = (cb: () => void) => {
  window.addEventListener("we3-online", cb);
  return () => window.removeEventListener("we3-online", cb);
};
const read = () => (typeof window !== "undefined" ? (window.__we3Online ?? 0) : 0);

export function LiveNow() {
  const n = useSyncExternalStore(subscribe, read, () => 0);
  if (n < 1) return null;
  return (
    <p className="mm-live" role="status" aria-live="polite">
      <i aria-hidden="true" />
      <b>{n}</b> {n === 1 ? "person is" : "people are"} live on the website
    </p>
  );
}
