"use client";

import { useEffect, useState } from "react";
import { REACH_EVENT } from "./globe";

/**
 * The names of the places next to the globe (global reach). The first one is the head office; the others light up one after the other
 * in step with the globe, which turns to every country and sends a line of light there.
 */
export function ReachPlaces({ labels }: { labels: string[] }) {
  const [active, setActive] = useState(-1); // index among the countries (the places after the first one); -1 = none
  useEffect(() => {
    const on = (e: Event) => setActive(Number((e as CustomEvent).detail));
    window.addEventListener(REACH_EVENT, on);
    return () => window.removeEventListener(REACH_EVENT, on);
  }, []);
  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {labels.map((label, i) => (
        <li key={label} className="rp-chip" data-hq={i === 0} data-on={i > 0 && i - 1 === active}>
          {label}
        </li>
      ))}
    </ul>
  );
}
