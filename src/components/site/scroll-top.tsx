"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Every page opens at its first screen (owner, 2026-11-13): after a reload, a click, or the back button the browser does not bring back an old scroll position,
// and the smooth-scroll (Lenis) is put at the top too. A link with a #hash still goes to its place.
export function ScrollTop() {
  const path = usePathname();
  useEffect(() => {
    try {
      history.scrollRestoration = "manual";
    } catch {}
  }, []);
  useEffect(() => {
    if (location.hash) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: { immediate: boolean; force: boolean }) => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [path]);
  return null;
}
