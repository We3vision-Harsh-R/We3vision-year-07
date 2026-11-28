"use client";

import { NAME_KEY, cleanName } from "@/lib/presence";
import { loadTheme, saveTheme } from "@/lib/theme";

// The first name of the visitor, as it is typed on the Careers page (career/journey.tsx). It is the label ("You") on the visitor's own cursor:
// while it is typed the label changes with every letter (setLiveName, nothing is saved), and when the question is answered it is kept like the name
// of the first visit (commitName: the same place, so the whole site knows it). An empty name goes back to "You".

export const NAME_LIVE_EVENT = "we3-name-live";
const NAME_EVENT = "we3-name"; // (presence.tsx: tells the server and the visitor log)

let live = "";

/** what is typed right now ("" = nothing: the cursor then falls back to the saved name or "You") */
export const getLiveName = () => live;

/** the name that is known from before (the picker of the theme or the first visit), "" when there is none */
export function knownName(): string {
  let own = "";
  try {
    own = localStorage.getItem(NAME_KEY) || "";
  } catch {}
  return cleanName(loadTheme()?.name || own);
}

/** the label of the cursor changes while the name is typed */
export function setLiveName(v: string) {
  live = cleanName(v);
  window.dispatchEvent(new Event(NAME_LIVE_EVENT));
}

/** the name is given: keep it (and tell the server), so that the label stays on every page and on the next visit */
export function commitName(v: string) {
  const n = cleanName(v);
  live = n;
  if (n) {
    try {
      localStorage.setItem(NAME_KEY, n);
    } catch {
      /* private mode: the name then only lasts for this visit */
    }
    // a name written in the colour picker comes before the saved name: keep the two the same
    const t = loadTheme();
    if (t && t.name && t.name !== n) saveTheme({ ...t, name: n });
    window.dispatchEvent(new Event(NAME_EVENT));
  }
  window.dispatchEvent(new Event(NAME_LIVE_EVENT));
}
