import "@/styles/footer-redesign.css";
import type { SiteSettings } from "@/lib/cms/settings";
import Image from "next/image";
import { FooterConsole, FooterGlow } from "./footer-console";
import { FooterWord, ToTop } from "./footer-word";
import { SmartLink } from "./smart-link";

// More command groups of the footer console, next to the three menus of the admin panel (services, technology, company): the other pages and the
// sections of the home page, so that every page of the site can be found from the footer. Real pages only.
const MORE_GROUPS = [
  {
    label: "Brand",
    items: [
      { label: "Brand Identity", href: "/brand-identity" },
      { label: "Brand Development", href: "/brand-development-services" },
      { label: "Zero to N Brand Development", href: "/zero-to-n-brand-development" },
      { label: "Brand Kit Design", href: "/brand-kit-design" },
      { label: "Brand Video Production", href: "/brand-video-production" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "SEO", href: "/seo" },
      { label: "Meta Marketing", href: "/meta-marketing-services" },
      { label: "Physical Marketing", href: "/physical-marketing-services" },
    ],
  },
  {
    label: "Software",
    items: [
      { label: "Software Development", href: "/software-development-services" },
      { label: "Shopify Plugin Development", href: "/shopify-plugin-development-services" },
      { label: "WordPress Plugin Development", href: "/wordpress-plugin-development-company" },
    ],
  },
  {
    label: "Products",
    items: [
      { label: "All products", href: "/products" },
      { label: "WeThink", href: "/products/wethink" },
      { label: "WePresent", href: "/products/wepresent" },
      { label: "WeJobs", href: "/products/wejobs" },
      { label: "WeBugMate", href: "/products/webugmate" },
      { label: "WePte", href: "https://wepte.online/" },
    ],
  },
  {
    label: "Home",
    items: [
      { label: "Services", href: "/#services" },
      { label: "Industries", href: "/#industries" },
      { label: "Tools & Technologies", href: "/#tools" },
      { label: "Global Reach", href: "/#reach" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];

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
  const social = site.social.filter((s) => s.href.startsWith("http")).map((s) => ({ label: s.label, href: s.href }));
  const groups = [...site.menus, ...MORE_GROUPS, ...(social.length ? [{ label: "Social", items: social }] : [])];
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
          <FooterConsole menus={groups} />
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
          {groups.filter((g) => g.label !== "Social").map((menu) => (
            <ul key={menu.label} aria-label={menu.label}>
              {menu.items.map((item) => (
                <li key={item.label + item.href}>
                  <SmartLink href={item.href} tabIndex={-1}>
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          ))}
        </nav>
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
