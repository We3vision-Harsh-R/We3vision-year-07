import "@/styles/footer-redesign.css";
import type { SiteSettings } from "@/lib/cms/settings";
import Image from "next/image";
import { FooterConsole, FooterGlow } from "./footer-console";
import { FooterWord, ToTop } from "./footer-word";
import { SmartLink } from "./smart-link";

function SocialIcon({ label, href }: { label: string; href: string }) {
  const name = label.toLowerCase();
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="ft-soc">
      {name.includes("linkedin") ? (
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.75 9.75h3.8v1.6h.06c.53-1 1.82-2.05 3.75-2.05 4 0 4.74 2.63 4.74 6.05V21h-4v-5.05c0-1.2-.02-2.75-1.67-2.75-1.68 0-1.94 1.31-1.94 2.66V21h-4z" />
        </svg>
      ) : name.includes("instagram") ? (
        <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
        </svg>
      ) : (
        <span className="text-sm font-semibold">{label.slice(0, 1)}</span>
      )}
    </a>
  );
}

/**
 * The footer: a big sentence with a button, then ONE wide console (its buttons and typed commands are the links to every page) with the brand
 * under it and, at the very bottom, the big name of the company that lights up where the mouse is.
 */
export function Footer({ site }: { site: SiteSettings }) {
  return (
    <footer className="ft" data-pause-off>
      <FooterGlow>
      <div className="ft-in">
        {/* 1. the sentence and the button */}
        <div className="ft-top-row">
          <div>
            <p className="ft-kicker">Let&apos;s work together</p>
            <p className="ft-big">
              Have an idea?
              <br />
              <span>Let&apos;s build it.</span>
            </p>
          </div>
          <SmartLink href="/contact" className="rp-cta">
            <span>Start a project</span>
            <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </SmartLink>
        </div>

        {/* 1b. the console: a small terminal to play with, and next to it the brand */}
        <div className="fx-row">
          <FooterConsole menus={site.menus} />
          <div className="fx-side">
            <Image src="/brand/logo-stacked-dark.webp" alt={site.name} width={600} height={642} className="h-auto w-32" unoptimized />
            <p className="ft-brand-t">{site.tagline}</p>
            {site.menuNote && <p className="ft-note">{site.menuNote}</p>}
            {site.social.length > 0 && (
              <div className="ft-socs">
                {site.social.map((s) => (
                  <SocialIcon key={s.label + s.href} label={s.label} href={s.href} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* the links of the console as plain links (not drawn): search engines and screen readers still find every page from the footer */}
        <nav className="sr-only" aria-label="All pages">
          {site.menus.map((menu) => (
            <ul key={menu.label} aria-label={menu.label}>
              {menu.items.map((item) => (
                <li key={item.label + item.href}>
                  <SmartLink href={item.href}>{item.label}</SmartLink>
                </li>
              ))}
            </ul>
          ))}
        </nav>
        {/* 2. a place for the festival (Admin > Fest, "Family at home in the footer"): empty and without height when no festival is on */}
        <div className="ft-home-slot" />
      </div>

      {/* 3. the big name */}
      <FooterWord text={site.name} />

      <div className="ft-in ft-bottom">
        <p>{site.copyright}</p>
        <ToTop />
      </div>
      </FooterGlow>
    </footer>
  );
}
