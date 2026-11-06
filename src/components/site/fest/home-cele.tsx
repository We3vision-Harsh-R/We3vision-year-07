"use client";

import "@/styles/home-cele.css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// THE HOME CELEBRATION (owner, 2026-11-06): one click on the hero of the home page blurs the hero away and the whole window becomes a quiet night
// screen over a locked page: today's date and "Happy Dhanteras" at the top and, at the bottom, an empty 2D floor (the same flat floor as the family
// in the footer, .fh-floor). The art (the story, the house, the people, the rockets) was removed on the owner's order the same day; the floor is
// kept empty so the next scenes can be put on it. Styles: src/styles/home-cele.css (prefix "hc-"). Plain DOM + CSS, no library, own chunk.

const stamp = () => Date.now();

export function HomeCele({ onClose }: { onClose: () => void }) {
  const [date] = useState(() => new Date(stamp()).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  const [leaving, setLeaving] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const done = useRef(false);
  const close = useRef(() => {});
  useEffect(() => {
    close.current = () => {
      if (done.current) return;
      done.current = true;
      setLeaving(true);
      timer.current = window.setTimeout(onClose, 650);
    };
  }, [onClose]);
  useEffect(() => {
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      window.clearTimeout(timer.current);
    };
  }, []);

  return createPortal(
    <div className="hc-root" data-leaving={leaving} role="dialog" aria-modal="true" aria-label="Happy Dhanteras">
      <div className="hc-veil" aria-hidden />
      <header className="hc-top">
        <p className="hc-date">{date}</p>
        <h2 className="hc-title">
          Happy <span>Dhanteras</span>
        </h2>
      </header>
      <i className="hc-floor" aria-hidden />
      <button ref={closeRef} type="button" className="hc-close" onClick={() => close.current()}>
        <span aria-hidden>×</span> Back to the website
      </button>
    </div>,
    document.body,
  );
}
