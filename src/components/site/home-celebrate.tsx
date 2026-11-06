"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useFest } from "./fest/use-fest";

// THE START OF THE HOME CELEBRATION (Admin > Fest > Places > "Home celebration"). Only while that switch is on: a small glowing pill on the hero says
// "Tap to celebrate", and one click on the hero (the pill or any empty part of it, not a link, button or the AI card) opens the celebration scene
// (fest/home-cele.tsx, its own chunk, fetched by that click). While it is open the page is locked (no scroll, the smooth-scroll engine stops) and,
// once the scene covers the window, nothing else of the page is drawn. With the switch off this renders nothing and nothing is downloaded.
const Scene = dynamic(() => import("./fest/home-cele").then((m) => m.HomeCele), { ssr: false });

const KEEP = "a, button, input, textarea, select, label, [role='button'], .ap, .hx-rec";

type Lenis = { stop?: () => void; start?: () => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

export function HomeCelebrate() {
  const on = useFest()?.has("homecele") ?? false;
  const [open, setOpen] = useState(false);
  const pill = useRef<HTMLButtonElement>(null);

  // a click on an empty part of the hero starts it too
  useEffect(() => {
    if (!on) return;
    const hero = pill.current?.closest(".hx-panel");
    if (!hero) return;
    const click = (e: Event) => {
      if (!(e.target instanceof Element) || e.target.closest(KEEP)) return;
      setOpen(true);
    };
    hero.addEventListener("click", click);
    return () => hero.removeEventListener("click", click);
  }, [on]);

  // the lock: no scroll, then nothing else of the page is drawn
  useEffect(() => {
    if (!open) return;
    const h = document.documentElement;
    h.classList.add("hc-lock");
    lenis()?.stop?.();
    const t = window.setTimeout(() => h.classList.add("hc-hide"), 1000);
    return () => {
      window.clearTimeout(t);
      h.classList.remove("hc-lock", "hc-hide");
      lenis()?.start?.();
    };
  }, [open]);

  if (!on) return null;
  return (
    <>
      <button ref={pill} type="button" className="hcp" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M3 12Q12 22 21 12Z" fill="#c2410c" />
          <path className="hcp-f" d="M12 11Q6 5 12 -1Q18 5 12 11Z" transform="translate(0 2)" fill="#fde047" />
        </svg>
        Tap to celebrate Dhanteras
      </button>
      {open && <Scene onClose={() => setOpen(false)} />}
    </>
  );
}
