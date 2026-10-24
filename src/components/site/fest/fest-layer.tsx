"use client";

import "@/styles/fest.css";
import "@/styles/fest-places.css";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { FEST_TEST, type FestConfig, festFor } from "@/lib/fest";
import { DiyaShape } from "./fest-art";
import { FestBrand } from "./fest-brand";
import { FestPointer } from "./fest-pointer";
import { FestTop } from "./fest-top";

// The festival theme on the laptop website (Admin > Fest). It keeps html[data-fest] (the festival), html[data-fest-fx] (the switches that are on) and
// html[data-fest-density] right while the visitor moves between pages (the boot script in the site layout sets them before the first paint) and
// draws the pieces that belong to no section:
//   fest-top.tsx      the layer above the whole page (lanterns, kandils, toran, diyas, rangoli, glow, fireworks, embers, petals, anar)
//   fest-pointer.tsx  the pointer effects (sparkler, rocket on click, diya, petal trail, rangoli bloom, chakri)
//   fest-brand.tsx    the festive ground next to the company name
//   the footer        a row of diyas on the top edge of the footer
// The places that have their own festival look read the same attributes (useFest): the big menu, the industries road, the offices of the About
// and Team pages. Styles: src/styles/fest.css and fest-places.css ("fs-"). Nothing here moves layout; everything is pointer-events: none.
// While developing, an address with ?festtest shows every effect (the code is removed from the production build, unless it is built with
// NEXT_PUBLIC_FEST_PREVIEW=1 to look at the effects in a local production build; the real deploy never sets it).

/** a row of diyas on the top edge of the footer (put into the footer, which is drawn by the server) */
function FooterDiyas() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setHost(document.querySelector<HTMLElement>("footer.ft")), 0);
    return () => window.clearTimeout(t);
  }, []);
  if (!host) return null;
  return createPortal(
    <div className="fs-ftdiyas" aria-hidden>
      {Array.from({ length: 15 }, (_, i) => (
        <i key={i} style={{ "--k": i } as CSSProperties}>
          <DiyaShape w={22} />
          <b />
        </i>
      ))}
    </div>,
    host,
  );
}

export function FestLayer({ cfg }: { cfg: FestConfig }) {
  const path = usePathname() || "/";
  const [test, setTest] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_FEST_PREVIEW === "1") {
      const t = window.setTimeout(() => setTest(new URLSearchParams(window.location.search).has("festtest")), 0);
      return () => window.clearTimeout(t);
    }
  }, []);
  const fest = festFor(test ? FEST_TEST : cfg, path);
  const fxList = fest ? Object.entries(fest.effects).filter(([, on]) => on).map(([k]) => k) : [];
  const fxKey = fxList.join(" ");
  const id = fest?.id ?? "";
  const density = fest?.density ?? "normal";

  // the attributes follow the page while the visitor moves around the site
  useEffect(() => {
    const h = document.documentElement;
    if (id) {
      h.setAttribute("data-fest", id);
      h.setAttribute("data-fest-fx", fxKey);
      h.setAttribute("data-fest-density", density);
    } else {
      h.removeAttribute("data-fest");
      h.removeAttribute("data-fest-fx");
      h.removeAttribute("data-fest-density");
    }
  }, [id, fxKey, density]);

  if (!fest) return null;
  const fx = new Set(fxList);
  const site = ["skylanterns", "fireworks", "embers", "petals", "kandils", "toran", "diyaline", "rangoli", "glow", "anar"].some((k) => fx.has(k));
  const pointer = ["sparkler", "rocket", "diya", "petaltrail", "bloom", "chakri"].some((k) => fx.has(k));
  return (
    <>
      {(site || pointer) && <FestTop fx={fx} density={density} />}
      {pointer && <FestPointer fx={fx} />}
      {fx.has("brand") && <FestBrand />}
      <FooterDiyas />
    </>
  );
}
