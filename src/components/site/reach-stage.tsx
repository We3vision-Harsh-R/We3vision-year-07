"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Globe, REACH_EVENT } from "./globe";

type Place = { label: string; lat: number; lng: number };

// GLOBAL REACH of the home page. Nothing is pinned to the scroll any more (owner, 2026-11-06): the section scrolls like the others, the globe
// turns round by itself all the time (smooth, no stops), and the list lights up the country the globe sends its line of light to.
const pad = (n: number) => String(n).padStart(2, "0");

export function ReachStage({ places, head, text, button }: { places: Place[]; head: ReactNode; text: string; button?: ReactNode }) {
  const [lit, setLit] = useState(-1); // index among the countries (the places after the head office)
  useEffect(() => {
    const on = (e: Event) => setLit(Number((e as CustomEvent).detail));
    window.addEventListener(REACH_EVENT, on);
    return () => window.removeEventListener(REACH_EVENT, on);
  }, []);

  return (
    <div className="gr-track">
      <div className="gr-sticky">
        <div className="gr-copy">
          {head}
          <p className="gr-text">{text}</p>
          {button}
          <ol className="gr-list" aria-label="Where we work">
            {places.map((p, i) => (
              <li key={p.label} data-on={i > 0 && i - 1 === lit} data-hq={i === 0}>
                <span className="gr-row">
                  <i>{pad(i + 1)}</i>
                  <span>{p.label}</span>
                  {i === 0 && <em>Head office</em>}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="gr-globe">
          <div className="gr-halo" aria-hidden />
          <Globe places={places} label={`Globe showing ${places.map((p) => p.label).join(", ")}`} />
          <p className="gr-now" aria-live="polite" data-on={lit >= 0}>
            {lit >= 0 && places[lit + 1] ? (
              <>
                <b>{places[lit + 1].label}</b>
                <span>Clients we work with</span>
              </>
            ) : (
              <>
                <b>{places[0]?.label}</b>
                <span>Our head office</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
