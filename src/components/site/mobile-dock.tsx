"use client";

import { usePathname } from "next/navigation";
import { SERVICE_GROUPS } from "../../lib/site-menu";
import { SmartLink } from "./smart-link";

// The bottom bar of phone + tablet (below 1024px; owner 2026-10-29, after the glass tab bar of a phone app): a floating glass capsule with five
// tabs. A lighter glass pill sits behind the active tab and slides to the next one (a spring with a little jelly). Services opens the wheel
// (service-wheel.tsx), Menu opens the big menu (mega-menu.tsx); the other three are pages. Looks: styles/nav-bar.css (dk-).
const SERVICE_HREFS = new Set(SERVICE_GROUPS.flatMap((g) => g.items.map((i) => i.href)));

const ICONS: Record<string, string> = {
  home: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z",
  services: "M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z",
  work: "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM9 6V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M4 12h16",
  contact: "M4 6h16v12H4zM4 7l8 6 8-6",
  menu: "M5 8h14M5 12h14M5 16h14",
};

function Tab({ icon, label }: { icon: string; label: string }) {
  return (
    <>
      <svg viewBox="0 0 24 24" aria-hidden className="dk-ic">
        <path d={ICONS[icon]} />
      </svg>
      <span>{label}</span>
    </>
  );
}

export function MobileDock({
  menuOpen,
  wheelOpen,
  onServices,
  onMenu,
  onPage,
  onWarm,
}: {
  menuOpen: boolean;
  wheelOpen: boolean;
  onServices: () => void;
  onMenu: () => void;
  onPage: () => void;
  onWarm: () => void;
}) {
  const path = usePathname();
  // which tab is lit: an open pop-up wins, then the page you are on (a service page lights Services)
  const active = menuOpen ? 4 : wheelOpen ? 1 : path === "/" ? 0 : SERVICE_HREFS.has(path) ? 1 : path.startsWith("/portfolio") ? 2 : path.startsWith("/contact") ? 3 : -1;
  return (
    <nav
      className="dk"
      aria-label="Main"
      style={{ "--i": Math.max(active, 0), "--on": active >= 0 ? 1 : 0 } as React.CSSProperties}
      onTouchStart={onWarm}
      onPointerEnter={onWarm}>
      <span className="dk-pill" aria-hidden>
        <i key={active} />
      </span>
      <ul className="dk-ul">
        <li data-on={active === 0}>
          <SmartLink href="/" onClick={onPage} className="dk-b" aria-current={path === "/" ? "page" : undefined}>
            <Tab icon="home" label="Home" />
          </SmartLink>
        </li>
        <li data-on={active === 1}>
          <button type="button" className="dk-b" aria-expanded={wheelOpen} onClick={onServices}>
            <Tab icon="services" label="Services" />
          </button>
        </li>
        <li data-on={active === 2}>
          <SmartLink href="/portfolio" onClick={onPage} className="dk-b">
            <Tab icon="work" label="Work" />
          </SmartLink>
        </li>
        <li data-on={active === 3}>
          <SmartLink href="/contact" onClick={onPage} className="dk-b">
            <Tab icon="contact" label="Contact" />
          </SmartLink>
        </li>
        <li data-on={active === 4}>
          <button type="button" className="dk-b" aria-expanded={menuOpen} onClick={onMenu}>
            <Tab icon="menu" label="Menu" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
