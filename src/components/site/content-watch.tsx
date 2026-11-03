"use client";

import { useEffect } from "react";

// Keeps an open page on the newest content without downloading the content again and again (owner, 2026-11-03).
// `built` is the content version this page was made with (lib/content-version.ts). The page asks ONLY the version number (a few bytes):
//   - when it opens and on every reload (a reload always checks first), then
//   - every 15 seconds while the tab is visible, but only while the editor is not locked: a locked editor means the content is final, so
//     after the first check the page stops asking.
// When the number is not the one the page was built with, the page loads once more (at most once per number, so it can never loop).
const EVERY_MS = 15000;

export function ContentWatch({ built }: { built: number }) {
  useEffect(() => {
    let off = false;
    let timer = 0;
    const check = async () => {
      try {
        const res = await fetch("/api/content-version", { cache: "no-store", credentials: "omit" });
        if (!res.ok || off) return;
        const { v, locked } = (await res.json()) as { v: number; locked: boolean };
        if (v !== built) {
          let tried = "";
          try {
            tried = sessionStorage.getItem("w3v-cv") || "";
            if (tried !== String(v)) {
              sessionStorage.setItem("w3v-cv", String(v));
              location.reload();
              return;
            }
          } catch {
            /* private mode: no reload, the next visit has the new content */
          }
        }
        if (locked) {
          window.clearInterval(timer); // final content: stop asking
          timer = 0;
          return;
        }
        if (!off && !timer) timer = window.setInterval(() => !document.hidden && void check(), EVERY_MS);
      } catch {
        /* offline: the next visit checks again */
      }
    };
    void check();
    return () => {
      off = true;
      window.clearInterval(timer);
    };
  }, [built]);
  return null;
}
