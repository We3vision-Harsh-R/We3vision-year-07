"use client";

import "@/styles/fest.css";
import "@/styles/fest-places.css";
import "@/styles/diwali.css";
import type { CSSProperties } from "react";
import { DIWALI_ITEM } from "../home-diwali";
import { Kandil, ToranGarland } from "./fest-art";

// THE BIG MENU IN DIWALI (Admin > Fest, "Places"): drawn inside the pop-up of the menu (mega-menu.tsx shows it while the "menu" switch is on).
// A toran of marigolds and bulbs along the top edge and sparks that rise when the menu opens (owner, 2026-10-31: the corner kandils, the rangolis
// and the people under the service lists are gone). The links get a flame and a gold light when the mouse is on them (fest-places.css, html[data-fest-fx~="menu"]).
// Everything is inside the rounded pop-up (it is clipped by it), nothing takes a click.

export function FestMenuDecor() {
  return (
    <div className="fs-menu" aria-hidden>
      <div className="fs-menu-toran">
        <ToranGarland scallops={10} seg={150} sag={20} bulbSize={3} />
      </div>
      <b className="fs-menu-sparks">
        {Array.from({ length: 22 }, (_, i) => (
          <s key={i} style={{ "--i": i, "--x": `${(i * 37) % 100}%`, "--t": `${2.6 + ((i * 7) % 5) * 0.5}s`, "--d": `${((i * 13) % 10) * -0.4}s` } as CSSProperties} />
        ))}
      </b>
    </div>
  );
}

// THE EMPTY PLACE OF THE "EXPLORE" ROW (owner, 2026-10-31): the pages list is short, so on its right there is room. Two colleagues stand on the line
// above it and burst crackers (the couple with sparklers of the home street, home-diwali.tsx), and three kandils hang from the line below, each
// swinging like a pendulum (a longer cord swings slower). Placed inside the row (fest-places.css .fs-mx), nothing takes a click.

const LANTERNS: { x: number; len: number; w: number; d: number }[] = [
  { x: 57, len: 12, w: 30, d: -0.8 },
  { x: 62, len: 40, w: 50, d: -2.1 },
  { x: 66.5, len: 24, w: 36, d: -1.4 },
];
const Couple = DIWALI_ITEM.couple;

export function FestMenuExplore({ people }: { people: boolean }) {
  return (
    <div className="fs-mx" aria-hidden>
      {people && (
        <span className="fs-mx-people">
          <Couple />
        </span>
      )}
      {LANTERNS.map((l, i) => (
        <i key={i} className="fs-mx-kandil" style={{ left: `${l.x}%`, width: l.w, "--len": `${l.len}px`, "--T": `${(Math.PI * Math.sqrt((l.len + l.w) / 60 / 9.8)).toFixed(2)}s`, "--d": `${l.d}s` } as CSSProperties}>
          <u />
          <Kandil />
        </i>
      ))}
    </div>
  );
}
