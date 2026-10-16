"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { AiChat } from "./ai-chat";
import { GlowEdge } from "./glow-edge";
import { SmartLink } from "./smart-link";

type Link = { label: string; href: string };
export type MegaData = {
  nav: Link[];
  menus: { label: string; items: Link[] }[];
  title: string;
  text: string;
  cta: string;
  ctaHref: string;
  badges: { label: string; image: string }[];
  social: Link[];
};

/** the icon of a social link (LinkedIn, Instagram; the first letter for any other) */
function SocialGlyph({ label }: { label: string }) {
  const name = label.toLowerCase();
  if (name.includes("linkedin"))
    return (
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.75 9.75h3.8v1.6h.06c.53-1 1.82-2.05 3.75-2.05 4 0 4.74 2.63 4.74 6.05V21h-4v-5.05c0-1.2-.02-2.75-1.67-2.75-1.68 0-1.94 1.31-1.94 2.66V21h-4z" />
      </svg>
    );
  if (name.includes("instagram"))
    return (
      <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
      </svg>
    );
  return <span className="text-sm font-semibold">{label.slice(0, 1)}</span>;
}

/** links without doubles (the same address is shown once) */
const unique = (list: Link[]) => list.filter((l, i) => l.href && list.findIndex((o) => o.href === l.href) === i);

// The big menu is a pop-up that grows out of the menu at the bottom of the page (it opens when the mouse comes onto any button of that menu, or when
// the round button is tapped). From top to bottom: the AI chat, then who we are (logo and the words of the first screen of the old site) and the links of ALL pages as plain lists (services and technology side by side, the other pages under them). It closes when the
// mouse leaves (when it was opened with a click: with a click outside, Escape, or a link).
export function MegaMenu({
  open,
  sticky,
  onClose,
  onEnter,
  onLeave,
  data,
}: {
  open: boolean;
  sticky: boolean;
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
  data: MegaData;
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const pathname = usePathname();

  // the lists: the services, the technologies, and one more with the pages of the site (menu at the bottom + the last footer column)
  const cols = useMemo(() => {
    const rest = data.menus.length > 2 ? data.menus.slice(0, -1) : data.menus;
    const last = data.menus.length > 2 ? data.menus[data.menus.length - 1].items : [];
    const pages = unique([...data.nav, ...last]);
    return [...rest.map((m) => ({ label: m.label, items: unique(m.items) })), ...(pages.length ? [{ label: "Explore", items: pages }] : [])];
  }, [data]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  let n = 0;
  const r = () => ({ "--i": n++ }) as React.CSSProperties;

  // one list: a title and the links (the page you are on is lit)
  const group = (col: { label: string; items: Link[] }, ci: number, cls: string, extra?: React.ReactNode) => (
    <div key={col.label} className={`${cls} mm-r`} style={r()}>
      <p className="mm-col-t">
        <i>{String(ci + 1).padStart(2, "0")}</i> {col.label}
      </p>
      <ul className="mm-li">
        {col.items.map((l, i) => (
          <li key={l.href}>
            <SmartLink href={l.href} aria-current={l.href === pathname ? "page" : undefined}>
              <i>{String(i + 1).padStart(2, "0")}</i>
              {l.label}
            </SmartLink>
          </li>
        ))}
      </ul>
      {extra}
    </div>
  );

  // the recognitions go under the second list (it is shorter than the first, so there is room)
  const recognised =
    data.badges.filter((b) => b.image).length > 0 ? (
      <div className="mm-rec">
        <p className="mm-rec-t">Recognised by</p>
        <ul>
          {data.badges
            .filter((b) => b.image)
            .map((b) => (
              <li key={b.label + b.image} title={b.label}>
                <Image src={b.image} alt={b.label} width={300} height={110} unoptimized />
              </li>
            ))}
        </ul>
      </div>
    ) : null;

  return createPortal(
    <div className="mm" data-open={open} data-sticky={sticky}>
      <div className="mm-back" onClick={onClose} aria-hidden />
      <div className="mm-pop bglow" inert={!open} role="dialog" aria-label="Site menu" onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()} onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}>
        {/* the border glow of the cards: it follows the pointer along the edge of the pop-up */}
        <GlowEdge />
        <span className="mm-bridge" aria-hidden />
        <div className="mm-in" data-lenis-prevent>
          {/* the AI chat, at the very top (its window opens downwards from here) */}
          <div className="mm-chat mm-r" style={r()}>
            <AiChat />
          </div>

          <div className="mm-grid">
            <section className="mm-intro">
              <div className="mm-r" style={r()}>
                <SmartLink href="/" onClick={onClose} className="mm-logo" aria-label="We3vision home">
                  <Image src="/brand/logo-horizontal-dark.webp" alt="We3vision Private Limited" width={900} height={218} />
                </SmartLink>
              </div>
              <h2 className="mm-h mm-r" style={r()}>
                {data.title}
              </h2>
              <p className="mm-p mm-r" style={r()}>
                {data.text}
              </p>
              {data.cta && (
                <div className="mm-r" style={r()}>
                  <SmartLink href={data.ctaHref || "/portfolio"} onClick={onClose} className="rp-cta">
                    <span>{data.cta}</span>
                    <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </SmartLink>
                </div>
              )}
              {data.social.length > 0 && (
                <div className="mm-follow mm-r" style={r()}>
                  <p className="mm-follow-t">Follow us</p>
                  <ul>
                    {data.social.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} title={l.label}>
                          <SocialGlyph label={l.label} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <nav className="mm-cols" aria-label="All pages" onClickCapture={(e) => (e.target as HTMLElement).closest("a") && onClose()}>
              <div className="mm-cols-top">{cols.slice(0, 2).map((col, ci) => group(col, ci, "mm-col", ci === 1 ? recognised : null))}</div>
              {cols.length > 2 && <div className="mm-more">{cols.slice(2).map((col, ci) => group(col, ci + 2, "mm-col"))}</div>}
            </nav>
          </div>

        </div>
      </div>
    </div>,
    document.body,
  );
}
