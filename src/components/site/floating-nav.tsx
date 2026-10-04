"use client";

import { useEffect, useRef, useState } from "react";
import { SmartLink } from "./smart-link";

type Item = { label: string; href: string };

// Same behaviour as the template's menu:
//  * a glass pill fixed 48px from the bottom, centred;
//  * scroll DOWN  -> the pill shrinks into a 54px round button with a hamburger icon;
//  * scroll UP (or tap the button) -> it grows back into the pill;
//  * it slides in from below when the page loads.
// Frosted glass: strong blur + colour boost of what is behind, a light-to-violet tint, a bright top edge and a soft drop shadow.
const GLASS =
  "border border-white/[0.14] bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(211,135,255,0.17))] backdrop-blur-[24px] backdrop-saturate-[1.6] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(211,135,255,0.2),0_12px_40px_rgba(0,0,0,0.4)]";
const SPRING = "ease-[cubic-bezier(0.16,1,0.3,1)]"; // fast start, long soft landing (like the template's spring)
const SIZE = 54;

function Hamburger() {
  return (
    <span aria-hidden className="relative block size-[18px]">
      <span className="absolute left-1/2 top-1 h-px w-4 -translate-x-1/2 rounded-full bg-violet" />
      <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 rounded-full bg-violet" />
      <span className="absolute bottom-1 left-1/2 h-px w-4 -translate-x-1/2 rounded-full bg-violet" />
    </span>
  );
}

export function FloatingNav({ items }: { items: Item[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [fullWidth, setFullWidth] = useState<number>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Slide in from below after the first paint.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Collapse while scrolling down, open again while scrolling up (and always near the top).
  useEffect(() => {
    let marker = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setCollapsed(false);
        marker = y;
      } else if (y > marker + 12) {
        setCollapsed(true);
        marker = y;
      } else if (y < marker - 12) {
        setCollapsed(false);
        marker = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The pill needs a real pixel width to animate smoothly (CSS cannot animate "auto").
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => setFullWidth(Math.ceil(list.getBoundingClientRect().width) + 2); // +2 = border
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [items]);

  // Phone menu: close on Escape or a tap outside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={`fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 transition-[opacity,transform] duration-700 sm:bottom-12 ${SPRING} ${
        ready ? "translate-y-0 opacity-100" : "translate-y-28 opacity-0"
      }`}
    >
      {/* Tablet / desktop: the pill */}
      <nav
        aria-label="Main"
        style={{ width: collapsed ? SIZE : fullWidth, height: SIZE }}
        className={`relative hidden overflow-hidden rounded-full transition-[width] duration-500 sm:block ${SPRING} ${GLASS}`}
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-3 top-px h-1/2 rounded-full bg-gradient-to-b from-white/[0.12] to-transparent" />
        <ul
          ref={listRef}
          inert={collapsed}
          className={`flex h-full w-max items-center gap-2.5 px-4 transition-opacity ${
            collapsed ? "pointer-events-none opacity-0 duration-150" : "opacity-100 delay-150 duration-300"
          }`}
        >
          {items.map((item) => (
            <li key={item.label + item.href}>
              <SmartLink href={item.href} className="block px-3 py-2.5 text-sm leading-[18px] text-orchid transition-colors duration-200 hover:text-violet">
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label="Open menu"
          tabIndex={collapsed ? 0 : -1}
          onClick={() => setCollapsed(false)}
          className={`absolute right-2 top-1/2 grid size-[38px] -translate-y-1/2 place-items-center rounded-full transition duration-300 ${SPRING} ${
            collapsed ? "scale-100 opacity-100 delay-100" : "pointer-events-none scale-0 opacity-0"
          }`}
        >
          <Hamburger />
        </button>
      </nav>

      {/* Phones: always the round button; tapping it opens the links above it */}
      <div className="relative sm:hidden">
        <ul
          id="mobile-menu"
          className={`absolute bottom-full left-1/2 mb-3 w-44 -translate-x-1/2 rounded-2xl p-2 transition duration-300 ${SPRING} ${GLASS} ${
            mobileOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"
          }`}
          inert={!mobileOpen}
        >
          {items.map((item) => (
            <li key={item.label + item.href}>
              <SmartLink href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-center text-sm text-orchid transition-colors hover:text-violet">
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
          className={`grid place-items-center rounded-full ${GLASS}`}
          style={{ width: SIZE, height: SIZE }}
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" className="size-[18px] fill-none stroke-violet" strokeWidth="1.2" strokeLinecap="round" aria-hidden>
              <path d="M4 4l16 16M20 4L4 20" />
            </svg>
          ) : (
            <Hamburger />
          )}
        </button>
      </div>
    </div>
  );
}
