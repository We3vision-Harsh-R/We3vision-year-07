"use client";

import "@/styles/diwali.css";
import type { CSSProperties } from "react";
import { DIWALI_ITEM, type DiwaliKind } from "../home-diwali";
import { DiyaShape } from "./fest-art";

// THE GROUND NEXT TO THE COMPANY NAME (Admin > Fest, "Places"): the logo at the top of the page stands on a small festive ground. On both
// sides people enjoy Diwali (a boy with a sparkler, a child and an anar, a woman with a thali of diyas, a couple with sparklers, a chakri), small
// diyas glow along the ground, a string of lights twinkles and tiny rockets climb and burst above. The people are the ones of the home street
// (home-diwali.tsx), drawn at half size. Fixed at the top of the window like the logo (it does not scroll), nothing to click.
// Styles: src/styles/fest-places.css (.fs-bg-*).

const FIGS: { k: DiwaliKind; x: number }[] = [
  { k: "sparkler", x: 6 },
  { k: "anar", x: 17 },
  { k: "lady", x: 29 },
  { k: "couple", x: 69 },
  { k: "chakri", x: 82 },
  { k: "sparkler", x: 93 },
];
const ROCKETS = [
  { x: 12, d: 0 },
  { x: 36, d: -1.7 },
  { x: 60, d: -3.1 },
  { x: 88, d: -0.9 },
];

export function FestBrand() {
  return (
    <div className="fs-brand" aria-hidden>
      {ROCKETS.map((r, i) => (
        <i key={i} className="fs-bg-rocket" style={{ left: `${r.x}%`, "--d": `${r.d}s` } as CSSProperties}>
          <b className="fs-bg-up" />
          <b className="fs-bg-burst">
            {Array.from({ length: 10 }, (_, k) => (
              <u key={k} style={{ "--a": `${k * 36}deg` } as CSSProperties} />
            ))}
          </b>
        </i>
      ))}
      <i className="fs-bg-ground" />
      <i className="fs-bg-bulbs" />
      {Array.from({ length: 13 }, (_, i) => {
        const x = 3 + (i / 12) * 94;
        if (x > 36 && x < 64) return null; // the logo stands here
        return (
          <i key={i} className="fs-bg-diya" style={{ left: `${x}%`, "--k": i } as CSSProperties}>
            <DiyaShape w={11} />
            <b />
          </i>
        );
      })}
      {FIGS.map((f, i) => {
        const Fig = DIWALI_ITEM[f.k];
        return (
          <span key={i} className="fs-bg-fig" style={{ left: `${f.x}%`, "--k": i } as CSSProperties}>
            <Fig />
          </span>
        );
      })}
    </div>
  );
}
