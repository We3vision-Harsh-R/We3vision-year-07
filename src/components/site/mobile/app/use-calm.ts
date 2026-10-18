"use client";

import { useSyncExternalStore } from "react";

const Q = "(prefers-reduced-motion: reduce)";
const sub = (cb: () => void) => {
  const m = window.matchMedia(Q);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** true when the visitor asked for less motion (false on the server, so the first paint is the same everywhere) */
export const useCalm = () => useSyncExternalStore(sub, () => window.matchMedia(Q).matches, () => false);
