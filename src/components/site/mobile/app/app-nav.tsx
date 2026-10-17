"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppsSheet } from "./apps-sheet";
import type { ContactInfo } from "./contact";
import { ContactSheet } from "./contact-sheet";
import { IcPhone } from "./icons";
import type { NavTab, OutlineItem } from "./nav-types";
import { TabIcon } from "./tab-icons";

/**
 * The app chrome at the bottom and the top right of a screen:
 *  - the TAB BAR (an iOS tab bar of liquid glass): one tab per main topic of the page + "Apps". A tap moves to that topic with a blur
 *    ease-in-out (the content blurs and dims, jumps while it is blurred, then clears) instead of a plain scroll;
 *  - the "Apps" tab opens the APPS SHEET (every page of the website as an app list on a blurred backdrop);
 *  - the round phone button at the top right opens the CONTACT SHEET (Call / WhatsApp / Message).
 * Client code; the tabs are worked out on the server (renderMobilePage).
 */
export function AppNav({ tabs, outline, contact, messageHref, currentHref, title }: { tabs: NavTab[]; outline: OutlineItem[]; contact: ContactInfo | null; messageHref: string; currentHref: string; title: string }) {
  const [active, setActive] = useState(0);
  const [sheet, setSheet] = useState<"" | "apps" | "contact">("");
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

  const jumpFromSheet = (id: string) => {
    setSheet("");
    window.setTimeout(() => go(id), 230);
  };

  return (
    <>
      <button type="button" className="ma-top-act" aria-label="Contact us" onClick={() => setSheet("contact")}>
        <IcPhone />
      </button>

      <nav className="ma-tabs" aria-label={`${title} sections`}>
        {tabs.map((t, i) => (
          <button key={t.label} type="button" className={`ma-nt${i === active && !sheet ? " is-on" : ""}`} aria-current={i === active ? "true" : undefined} onClick={() => { setSheet(""); go(t.id, i); }}>
            <TabIcon name={t.icon} />
            <span>{t.label}</span>
          </button>
        ))}
        <button type="button" className={`ma-nt ma-nt-apps${sheet === "apps" ? " is-on" : ""}`} aria-haspopup="dialog" aria-expanded={sheet === "apps"} onClick={() => setSheet(sheet === "apps" ? "" : "apps")}>
          <TabIcon name="apps" />
          <span>Apps</span>
        </button>
      </nav>

      <AppsSheet open={sheet === "apps"} onClose={() => setSheet("")} outline={outline} currentHref={currentHref} onJump={jumpFromSheet} />
      <ContactSheet open={sheet === "contact"} onClose={() => setSheet("")} contact={contact} messageHref={messageHref} onJump={jumpFromSheet} />
    </>
  );
}
