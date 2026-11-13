"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { openShare } from "./share-sheet";
import type { ContactInfo } from "./contact";
import { ContactSheet } from "./contact-sheet";
import type { NavTab } from "./nav-types";
import type { MegaData } from "@/components/site/mega-menu";
import { TabIcon } from "./tab-icons";
import { PandaMini } from "@/components/site/about/panda-mini";

/**
 * The app chrome at the bottom and the top right of a screen:
 *  - the TAB BAR (an iOS tab bar of liquid glass): one tab per main topic of the page + "Menu". A tap moves to that topic with a blur
 *    ease-in-out (the content blurs and dims, jumps while it is blurred, then clears) instead of a plain scroll;
 *  - the "Menu" tab opens the BIG MENU of the home page (mega-menu.tsx: the AI chat and the links of every page); it is loaded on the first tap;
 *  - the round phone button at the top right opens the CONTACT SHEET (Call / WhatsApp / Message).
 * Client code; the tabs are worked out on the server (renderMobilePage).
 */
export function AppNav({ tabs, mega, contact, messageHref, title }: { tabs: NavTab[]; mega: MegaData; contact: ContactInfo | null; messageHref: string; title: string }) {
  const [active, setActive] = useState(0);
  const [sheet, setSheet] = useState<"" | "contact">("");
  const [Mega, setMega] = useState<typeof import("@/components/site/mega-menu").MegaMenu | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const busy = useRef(false);
  const lock = useRef(false);

  // which topic is on screen: the last tab whose section top has passed 38 % of the screen height
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (lock.current) return;
      const line = window.innerHeight * 0.38;
      let on = 0;
      tabs.forEach((t, i) => {
        if (t.id === null) return;
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top <= line) on = i;
      });
      setActive(on);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [tabs]);

  /** blur out, jump while the screen is blurred, blur back in (a plain scroll is only used when the visitor asked for less motion) */
  const go = useCallback((id: string | null, index = -1) => {
    if (busy.current) return;
    const target = id === null ? null : document.getElementById(id);
    if (id !== null && !target) return;
    const jump = () => {
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.querySelector(".ma-root") ?? document.body).getPropertyValue("--ma-nav")) || 52) - 8;
        window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };
    if (index >= 0) setActive(index);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) {
      jump();
      return;
    }
    const root = document.querySelector<HTMLElement>(".ma-root");
    if (!root) {
      jump();
      return;
    }
    busy.current = true;
    lock.current = true;
    root.classList.add("is-blurring");
    window.setTimeout(() => {
      jump();
      requestAnimationFrame(() => {
        root.classList.remove("is-blurring");
        window.setTimeout(() => {
          busy.current = false;
          lock.current = false;
        }, 340);
      });
    }, 190);
  }, []);

  useEffect(() => {
    const on = (e: Event) => go((e as CustomEvent<string>).detail, -1);
    window.addEventListener("ma:jump", on);
    return () => window.removeEventListener("ma:jump", on);
  }, [go]);

  /** the Menu tab: the big menu is loaded on the first tap, then it opens (two frames later, so it grows in with its animation) */
  const toggleMenu = () => {
    setSheet("");
    if (Mega) {
      setMenuOpen((o) => !o);
      return;
    }
    void import("@/components/site/mega-menu").then((m) => {
      setMega(() => m.MegaMenu);
      requestAnimationFrame(() => requestAnimationFrame(() => setMenuOpen(true)));
    });
  };
  const shareThis = () => {
    setMenuOpen(false);
    window.setTimeout(() => openShare({ title, subtitle: window.location.host, url: window.location.href }), 260);
  };

  const jumpFromSheet = (id: string) => {
    setSheet("");
    window.setTimeout(() => go(id), 230);
  };

  return (
    <>
      <nav className="ma-tabs" aria-label={`${title} sections`}>
        <div className="ma-tabs-pill">
        {tabs.map((t, i) => (
          <button key={t.label} type="button" className={`ma-nt${i === active && !sheet && !menuOpen ? " is-on" : ""}`} aria-current={i === active && !sheet && !menuOpen ? "location" : undefined} onClick={() => { setSheet(""); setMenuOpen(false); go(t.id, i); }}>
            <TabIcon name={t.icon} />
            <span>{t.label}</span>
          </button>
        ))}
        <button type="button" className={`ma-nt ma-nt-menu${menuOpen ? " is-on" : ""}`} aria-haspopup="dialog" aria-expanded={menuOpen} onClick={toggleMenu}>
          <TabIcon name="menu" />
          <span>Menu</span>
        </button>
        </div>
        <button type="button" className={`ma-tabs-pd${sheet === "contact" ? " is-on" : ""}`} aria-label="Talk to us" aria-haspopup="dialog" onClick={() => { setMenuOpen(false); setSheet(sheet === "contact" ? "" : "contact"); }}>
          <PandaMini paws={false} />
        </button>
      </nav>

      {Mega && <Mega open={menuOpen} sticky onClose={() => setMenuOpen(false)} onEnter={() => {}} onLeave={() => {}} data={mega} onShare={shareThis} />}
      <ContactSheet open={sheet === "contact"} onClose={() => setSheet("")} contact={contact} messageHref={messageHref} onJump={jumpFromSheet} />
    </>
  );
}
