"use client";

import { useState } from "react";
import { MobileDock } from "@/components/site/mobile-dock";
import type { MegaData } from "@/components/site/mega-menu";
import "@/styles/nav-bar.css";

/**
 * The bottom bar of the phone pages in the home page's theme: the SAME bar as the home page (Home, Services, Work, Contact, Menu; the same
 * component as the laptop site's phone dock) with the same big menu and service wheel. It replaces the page's own tab bar and top bar.
 * The big menu and the service wheel are separate chunks, loaded when the visitor shows interest in them.
 */
export function PhoneDock({ mega }: { mega: MegaData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wheel, setWheel] = useState(false);
  const [Mega, setMega] = useState<typeof import("@/components/site/mega-menu").MegaMenu | null>(null);
  const [Wheel, setWheelC] = useState<typeof import("@/components/site/service-wheel").ServiceWheel | null>(null);
  const loadMega = () => {
    if (!Mega) void import("@/components/site/mega-menu").then((m) => setMega(() => m.MegaMenu));
  };
  const loadWheel = () => {
    if (!Wheel) void import("@/components/site/service-wheel").then((m) => setWheelC(() => m.ServiceWheel));
  };
  return (
    <>
      <MobileDock
        menuOpen={menuOpen}
        wheelOpen={wheel}
        onWarm={loadMega}
        onPage={() => {
          setMenuOpen(false);
          setWheel(false);
        }}
        onServices={() => {
          setMenuOpen(false);
          loadWheel();
          setWheel((w) => !w);
        }}
        onMenu={() => {
          setWheel(false);
          if (Mega) {
            setMenuOpen((o) => !o);
            return;
          }
          // first tap: load the menu, then open it two frames later so it grows in with its animation
          void import("@/components/site/mega-menu").then((m) => {
            setMega(() => m.MegaMenu);
            requestAnimationFrame(() => requestAnimationFrame(() => setMenuOpen(true)));
          });
        }}
      />
      {Wheel && <Wheel open={wheel} onClose={() => setWheel(false)} />}
      {Mega && <Mega open={menuOpen} sticky onClose={() => setMenuOpen(false)} onEnter={() => {}} onLeave={() => {}} data={mega} />}
    </>
  );
}
