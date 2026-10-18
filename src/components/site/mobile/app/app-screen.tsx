import type { CSSProperties, ReactNode } from "react";
import { Glyph } from "../glyph";
import "./app.css";
import "./ios27-sections.css";
import "./ios27-sections-b.css";
import "./blog-sections.css";
import "./apple.css";
import { ScreenChrome } from "./chrome";
import { AppNav } from "./app-nav";
import { Motion } from "./motion";
import { ShareHost } from "./share-sheet";
import { CtaBar } from "./cta-bar";
import type { ContactInfo } from "./contact";
import type { NavTab, OutlineItem } from "./nav-types";

/**
 * One screen of the "app" that a launcher icon opens: the status-bar space, the navigation bar (Back to the launcher, small title that
 * appears on scroll), the large title with the app's icon, the content and the sticky Call / WhatsApp / Message bar.
 * Server component; only <ScreenChrome> (the bar) is client code.
 */
export function AppScreen({
  title,
  subtitle,
  kicker,
  page,
  glyph,
  hue = 0,
  titleIsH1 = true,
  contact,
  messageHref = "/contact",
  cta = true,
  nav,
  children,
}: {
  /** the short name of the page (as in the admin panel's page list), shown as the large title */
  title: string;
  subtitle?: string;
  /** the launcher glyph of this page's icon (see glyph.tsx), shown beside the large title */
  glyph?: string;
  /** a small line above the title (the group of the page: "Development", "Creatives" ...) */
  kicker?: string;
  /** the slug of the page: lets a page style its own screen (data-page on the root) */
  page?: string;
  /** the hue offset of the launcher icon of this page */
  hue?: number;
  /** false when the first section has the real h1 (the hero heading), so the page keeps one h1 */
  titleIsH1?: boolean;
  contact: ContactInfo | null;
  /** where the "Message" button goes: "#contact" when the page has a contact form, otherwise the contact page */
  messageHref?: string;
  /** false hides the bottom bar (e.g. on the contact page itself) */
  cta?: boolean;
  /** the bottom tab bar (one tab per main topic + Apps), the Apps sheet and the contact button; when given it replaces the Call / WhatsApp / Message bar */
  nav?: { tabs: NavTab[]; outline: OutlineItem[]; currentHref: string };
  children: ReactNode;
}) {
  const Title = titleIsH1 ? "h1" : "p";
  return (
    <div className="ma-root" data-page={page}>
      <ScreenChrome title={title} />
      <Motion />
      <div className="ma-prog" aria-hidden="true" />
      <main className="ma-screen">
        <div className="ma-wrap">
          <header className={`ma-large${title.length > 24 ? " is-long" : ""}`}>
            {glyph && (
              <span className="ma-appic" style={{ "--off": hue } as CSSProperties} aria-hidden="true">
                <Glyph name={glyph} />
              </span>
            )}
            <div className="ma-large-t">
              {kicker && <p className="ma-kick">{kicker}</p>}
              <Title className="ma-title">{title}</Title>
              {subtitle && <p className="ma-sub">{subtitle}</p>}
            </div>
          </header>
          {children}
        </div>
      </main>
      {nav && <AppNav tabs={nav.tabs} outline={nav.outline} currentHref={nav.currentHref} title={title} contact={contact} messageHref={messageHref} />}
      <ShareHost />
      {cta && !nav && <CtaBar contact={contact} messageHref={messageHref} />}
    </div>
  );
}
