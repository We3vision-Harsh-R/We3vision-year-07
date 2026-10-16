"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MegaMenu, type MegaData } from "./mega-menu";
import { SmartLink } from "./smart-link";

type Item = { label: string; href: string };

// Same behaviour as the template's menu:
//  * a glass pill fixed 48px from the bottom, centred;
//  * scroll DOWN  -> the pill shrinks into a 54px round button with a hamburger icon;
//  * scroll UP (or tap the button) -> it grows back into the pill;
//  * it slides in from below when the page loads;
//  * the round button / the Menu button opens the big menu (mega-menu.tsx) with the logo, all the links and the AI chat.
// Frosted glass: strong blur + colour boost of what is behind, a light-to-violet tint, a bright top edge and a soft drop shadow.
const GLASS =
  "fn-glass border border-white/[0.14] bg-[linear-gradient(180deg,rgba(255,255,255,0.09),hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.17))] backdrop-blur-[24px] backdrop-saturate-[1.6] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.2),0_12px_40px_rgba(0,0,0,0.4)]";
const SPRING = "ease-[cubic-bezier(0.16,1,0.3,1)]"; // fast start, long soft landing (like the template's spring)
const SIZE = 54;

function Hamburger({ open = false }: { open?: boolean }) {
  return (
    <span aria-hidden className="fn-ham" data-open={open}>
      <i />
      <i />
      <i />
    </span>
  );
}

export function FloatingNav({ items, mega }: { items: Item[]; mega: MegaData }) {
  // the big menu: it opens when the mouse comes onto the menu (and closes when it leaves), or stays open (sticky) when it was opened with a click or a tap
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const hoverExpanded = useRef(false); // the round button was opened into the pill by the mouse: it folds back when the mouse leaves
  const closeTimer = useRef(0);
  const armed = useRef(true); // the mouse opens the menu again only after it has left the pill once (not right after a click closed it)
  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  // the mouse comes onto the menu: if it is the round button (the page is scrolled) it opens into the pill, and the big menu opens with it
  const hoverOpen = () => {
    if (collapsed) {
      hoverExpanded.current = true;
      setCollapsed(false);
    }
    openMenu();
  };
  const foldBack = () => {
    if (!hoverExpanded.current) return;
    hoverExpanded.current = false;
    if (window.scrollY >= 80) setCollapsed(true);
  };
  const closeMenu = () => {
    armed.current = false;
    window.clearTimeout(closeTimer.current);
    setMenuOpen(false);
    setSticky(false);
    foldBack();
  };
  const leaveMenu = () => {
    armed.current = true;
    if (sticky) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setMenuOpen(false);
      foldBack();
    }, 380);
  };
  const toggleMenu = () => {
    if (menuOpen && sticky) closeMenu();
    else {
      openMenu();
      setSticky(true);
    }
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  const [ready, setReady] = useState(false);
  const [fullWidth, setFullWidth] = useState<number>();
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [away, setAway] = useState(false);

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

  // Over the office of the web page (#guide) the menu would lie on the name field: it blurs away and eases back in as soon as the visitor scrolls,
  // then goes away again when the scrolling stops.
  useEffect(() => {
    const el = document.getElementById("guide");
    if (!el) return;
    let inside = false;
    let idle = 0;
    const settle = () => setAway(inside);
    const io = new IntersectionObserver(
      ([e]) => {
        inside = e.intersectionRatio > 0.3;
        window.clearTimeout(idle);
        setAway(inside);
      },
      { threshold: [0, 0.3, 0.6, 1] },
    );
    io.observe(el);
    const touched = () => {
      if (!inside) return;
      setAway(false);
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 1800);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key) && !(e.target instanceof HTMLInputElement)) touched();
    };
    window.addEventListener("wheel", touched, { passive: true });
    window.addEventListener("touchmove", touched, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.clearTimeout(idle);
      setAway(false);
      window.removeEventListener("wheel", touched);
      window.removeEventListener("touchmove", touched);
      window.removeEventListener("keydown", onKey);
    };
  }, [pathname]);

  // The pill needs a real pixel width to animate smoothly (CSS cannot animate "auto").
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const w = Math.ceil(list.getBoundingClientRect().width) + 2; // +2 = border
      setFullWidth(w);
      // the chat bar above the pill (hero) is as wide as the pill: it reads this
      document.documentElement.style.setProperty("--pill-w", `${w}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div
      ref={rootRef}
      data-page={pathname === "/" ? "home" : "inner"}
      className={`fn-root fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 transition-[opacity,transform,filter] duration-700 sm:bottom-12 ${SPRING} ${
        !ready ? "translate-y-28 opacity-0" : away ? "pointer-events-none translate-y-4 opacity-0 blur-[10px]" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Tablet / desktop: the pill */}
      <nav
        aria-label="Main"
        onPointerEnter={(e) => e.pointerType === "mouse" && hoverOpen()}
        onPointerMove={(e) => e.pointerType === "mouse" && armed.current && !menuOpen && hoverOpen()}
        onPointerLeave={(e) => e.pointerType === "mouse" && leaveMenu()}
        style={{ width: collapsed ? SIZE : fullWidth, height: SIZE }}
        className={`relative hidden overflow-hidden rounded-full transition-[width] duration-500 sm:block ${SPRING} ${GLASS}`}
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-3 top-px h-1/2 rounded-full bg-gradient-to-b from-white/[0.12] to-transparent" />
        <ul
          ref={listRef}
          inert={collapsed}
          className={`fn-list flex h-full w-max items-center gap-2.5 transition-opacity ${
            collapsed ? "pointer-events-none opacity-0 duration-150" : "opacity-100 delay-150 duration-300"
          }`}
        >
          {items.map((item) => (
            <li key={item.label + item.href}>
              <SmartLink href={item.href} onClick={closeMenu} className="fn-link block px-3 py-2.5 text-sm leading-[18px] text-orchid transition-colors duration-200 hover:text-violet">
                {item.label}
              </SmartLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              onPointerEnter={(e) => e.pointerType === "mouse" && openMenu()}
              className="fn-menu"
            >
              <Hamburger open={menuOpen} />
              Menu
            </button>
          </li>
        </ul>
        <button
          type="button"
          aria-label="Open menu"
          tabIndex={collapsed ? 0 : -1}
          onClick={toggleMenu}
          className={`absolute right-2 top-1/2 grid size-[38px] -translate-y-1/2 place-items-center rounded-full transition duration-300 ${SPRING} ${
            collapsed ? "scale-100 opacity-100 delay-100" : "pointer-events-none scale-0 opacity-0"
          }`}
        >
          <Hamburger />
        </button>
      </nav>

      {/* Phones: always the round button; it opens the big menu */}
      <div className="relative sm:hidden">
        <button type="button" aria-label="Open menu" onClick={toggleMenu} className={`grid place-items-center rounded-full ${GLASS}`} style={{ width: SIZE, height: SIZE }}>
          <Hamburger />
        </button>
      </div>
      <MegaMenu open={menuOpen} sticky={sticky} onClose={closeMenu} onEnter={openMenu} onLeave={leaveMenu} data={mega} />
    </div>
  );
}
