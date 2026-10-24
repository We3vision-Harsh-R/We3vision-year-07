"use client";

import type { CSSProperties } from "react";
import { Kandil, Rangoli, ToranGarland } from "./fest-art";

// THE BIG MENU IN DIWALI (Admin > Fest, "Places"): drawn inside the pop-up of the menu (mega-menu.tsx shows it while the "menu" switch is on).
// A toran of marigolds and bulbs along the top edge, two small kandils that swing from the top corners, rangolis in the bottom corners, and
// sparks that rise when the menu opens. The links get a flame and a gold light when the mouse is on them (fest-places.css, html[data-fest-fx~="menu"]).
// Everything is inside the rounded pop-up (it is clipped by it), nothing takes a click.

export function FestMenuDecor() {
  return (
    <div className="fs-menu" aria-hidden>
      <div className="fs-menu-toran">
        <ToranGarland scallops={10} seg={150} sag={20} bulbSize={3} />
      </div>
      <i className="fs-menu-kandil is-l" style={{ "--d": "-1s" } as CSSProperties}>
        <u />
        <Kandil />
      </i>
      <i className="fs-menu-kandil is-r" style={{ "--d": "-2.6s" } as CSSProperties}>
        <u />
        <Kandil />
      </i>
      <i className="fs-menu-rangoli is-br">
        <Rangoli size={240} />
      </i>
      <i className="fs-menu-rangoli is-bl">
        <Rangoli size={170} hue={-26} />
      </i>
      <b className="fs-menu-sparks">
        {Array.from({ length: 22 }, (_, i) => (
          <s key={i} style={{ "--i": i, "--x": `${(i * 37) % 100}%`, "--t": `${2.6 + ((i * 7) % 5) * 0.5}s`, "--d": `${((i * 13) % 10) * -0.4}s` } as CSSProperties} />
        ))}
      </b>
    </div>
  );
}
