"use client";

import "@/styles/fest.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { type FestConfig, festFor } from "@/lib/fest";

// The festival theme on the laptop website (Admin > Fest). It keeps html[data-fest] right while the visitor moves between pages (the boot
// script in the site layout sets it before the first paint) and draws the pieces that belong to no section:
//   the sky       paper lanterns rising slowly, fireworks and a soft warm light, BEHIND the content (the page background layer)
//   the corners   two akash kandils swaying at the top corners of the page (they scroll away with the page, nothing is covered)
//   the cursor    a few sparks follow the mouse
//   the footer    a row of diyas on the top edge of the footer
// Sections with their own festival look (the street of the home page, the city of the industries) read html[data-fest] in their CSS.
// Styles: src/styles/fest.css ("fs-"). Nothing here moves layout; everything is pointer-events: none.

const LANTERNS = [
  { x: 6, s: 1, d: 0, t: 26 },
  { x: 19, s: 0.7, d: -9, t: 31 },
  { x: 33, s: 0.85, d: -17, t: 28 },
  { x: 52, s: 0.65, d: -4, t: 34 },
  { x: 67, s: 0.95, d: -13, t: 27 },
  { x: 81, s: 0.75, d: -21, t: 32 },
  { x: 93, s: 0.9, d: -7, t: 29 },
];
const BURSTS = [
  { x: 12, y: 16, c: "#fbbf24", d: 0 },
  { x: 86, y: 12, c: "#fb923c", d: -2.2 },
  { x: 30, y: 8, c: "#4ade80", d: -4.1 },
  { x: 70, y: 20, c: "#fde68a", d: -5.6 },
  { x: 50, y: 6, c: "#f87171", d: -7.3 },
];

function SkyLantern() {
  return (
    <svg viewBox="0 0 40 54" width="40" height="54" aria-hidden>
      <defs>
        <linearGradient id="fs-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="0.55" stopColor="#fb923c" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <path d="M8 4h24l5 38H3z" fill="url(#fs-paper)" opacity="0.92" />
      <path d="M14 4l-3 38M26 4l3 38" stroke="#fff7ed" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="20" cy="44" rx="17" ry="3" fill="#7c2d12" />
      <circle cx="20" cy="42" r="3" fill="#fff7cc" />
    </svg>
  );
}

function Kandil() {
  return (
    <svg viewBox="0 0 80 150" width="80" height="150" aria-hidden>
      <line x1="40" y1="0" x2="40" y2="40" stroke="#3b2f2a" strokeWidth="1.4" />
      <rect x="33" y="38" width="14" height="6" rx="2" fill="#92400e" />
      {/* the star-shaped body of an akash kandil */}
      <path d="M40 44L58 62L76 70L58 80L40 104L22 80L4 70L22 62Z" fill="#f97316" />
      <path d="M40 44L58 62L40 74L22 62Z" fill="#fbbf24" />
      <path d="M22 80L40 74L58 80L40 104Z" fill="#dc2626" />
      <path d="M4 70L22 62L40 74L22 80Z" fill="#ea580c" />
      <path d="M76 70L58 62L40 74L58 80Z" fill="#ea580c" />
      <path d="M40 44L58 62L76 70L58 80L40 104L22 80L4 70L22 62Z" fill="none" stroke="#fde68a" strokeWidth="1.2" />
      <circle cx="40" cy="74" r="7" fill="#fff7cc" className="fs-kandil-core" />
      {/* tassels */}
      <path d="M30 98q-2 22 0 40M40 104q0 20 0 42M50 98q2 22 0 40" stroke="#fbbf24" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="138" r="2.4" fill="#dc2626" />
      <circle cx="40" cy="146" r="2.4" fill="#16a34a" />
      <circle cx="50" cy="138" r="2.4" fill="#dc2626" />
    </svg>
  );
}

/** sparks behind the mouse (a pool of 18 that is reused, nothing is created while the mouse moves) */
function SparkCursor() {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pool = Array.from(el.children) as HTMLElement[];
    let k = 0;
    let last = 0;
    const move = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 38) return;
      last = now;
      const s = pool[k++ % pool.length];
      s.style.left = `${e.clientX}px`;
      s.style.top = `${e.clientY}px`;
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 34}px`);
      s.style.setProperty("--dy", `${8 + Math.random() * 26}px`);
      s.classList.remove("is-on");
      void s.offsetWidth;
      s.classList.add("is-on");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div ref={box} className="fs-sparks" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

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
          <svg viewBox="0 0 22 10" width="22" height="10">
            <path d="M1 3Q11 12 21 3Z" fill="#c2410c" />
            <path d="M1 3Q11 7 21 3" stroke="#fdba74" strokeWidth="1" fill="none" />
          </svg>
          <b />
        </i>
      ))}
    </div>,
    host,
  );
}

export function FestLayer({ cfg }: { cfg: FestConfig }) {
  const path = usePathname() || "/";
  const fest = festFor(cfg, path);
  const fx = fest ? Object.entries(fest.effects).filter(([, on]) => on).map(([k]) => k).join(" ") : "";

  // the attribute follows the page while the visitor moves around the site
  const id = fest?.id ?? "";
  useEffect(() => {
    const h = document.documentElement;
    if (id) {
      h.setAttribute("data-fest", id);
      h.setAttribute("data-fest-fx", fx);
    } else {
      h.removeAttribute("data-fest");
      h.removeAttribute("data-fest-fx");
    }
  }, [id, fx]);

  if (!fest) return null;
  const on = (k: keyof typeof fest.effects) => fest.effects[k];
  return (
    <>
      {on("sky") && (
        <div className="fs-sky" aria-hidden>
          <i className="fs-warm" />
          {LANTERNS.map((l, i) => (
            <i key={i} className="fs-lantern" style={{ "--x": `${l.x}%`, "--s": l.s, "--d": `${l.d}s`, "--t": `${l.t}s` } as CSSProperties}>
              <SkyLantern />
            </i>
          ))}
          {BURSTS.map((b, i) => (
            <i key={i} className="fs-burst" style={{ "--x": `${b.x}%`, "--y": `${b.y}%`, "--c": b.c, "--d": `${b.d}s` } as CSSProperties}>
              {Array.from({ length: 16 }, (_, r) => (
                <b key={r} style={{ "--r": r } as CSSProperties} />
              ))}
            </i>
          ))}
        </div>
      )}
      {on("lanterns") && (
        <div className="fs-corners" aria-hidden>
          <i className="fs-kandil is-l">
            <Kandil />
          </i>
          <i className="fs-kandil is-r">
            <Kandil />
          </i>
        </div>
      )}
      {on("cursor") && <SparkCursor />}
      <FooterDiyas />
    </>
  );
}
