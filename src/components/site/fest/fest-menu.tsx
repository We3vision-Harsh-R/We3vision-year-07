"use client";

import "@/styles/fest.css";
import "@/styles/fest-places.css";
import "@/styles/diwali.css";
import type { CSSProperties } from "react";
import { DIWALI_ITEM, type DiwaliKind } from "../home-diwali";
import { DiyaShape, Kandil, Rangoli, ToranGarland } from "./fest-art";

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

// THE PEOPLE IN THE BIG MENU: the lists of the services have different lengths, so under the short ones there is an empty space. There (and nowhere
// else) a small floor is drawn with a few colleagues who burst crackers and enjoy: a boy with a sparkler under Creatives, a girl with an anar under
// Branding, a couple with sparklers under Marketing. They are the people of the home street (home-diwali.tsx) at about half size; the space is the
// rest of the column (flex: 1), so the figures are clipped, never pushing a link. Nothing takes a click. Styles: fest-places.css (.fs-ms-*).

const SCENES: Record<number, { who: DiwaliKind; x: number; diyas: number[] }> = {
  1: { who: "sparkler", x: 34, diyas: [8, 74, 90] },
  3: { who: "anar", x: 42, diyas: [10, 84] },
  4: { who: "couple", x: 40, diyas: [6, 76, 90] },
};

export function FestMenuScene({ gi }: { gi: number }) {
  const s = SCENES[gi];
  if (!s) return null;
  const Fig = DIWALI_ITEM[s.who];
  return (
    <div className="fs-ms" aria-hidden>
      <i className="fs-ms-floor" />
      {s.diyas.map((x, i) => (
        <i key={i} className="fs-ms-diya" style={{ left: `${x}%`, "--k": i } as CSSProperties}>
          <DiyaShape w={10} />
          <b />
        </i>
      ))}
      <span className="fs-ms-fig" style={{ left: `${s.x}%`, "--k": gi } as CSSProperties}>
        <Fig />
      </span>
    </div>
  );
}
