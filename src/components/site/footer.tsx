import type { SiteSettings } from "@/lib/cms/settings";
import { BrandTile } from "./brand-mark";
import { SmartLink } from "./smart-link";

function SocialIcon({ label, href }: { label: string; href: string }) {
  const name = label.toLowerCase();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-violet/15 bg-violet/[0.05] text-orchid transition hover:border-violet/40 hover:text-violet"
    >
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
        <span className="text-xs font-semibold">{label.slice(0, 1)}</span>
      )}
    </a>
  );
}

export function Footer({ site }: { site: SiteSettings }) {
  return (
    <footer className="relative px-4 pb-32 pt-24">
      <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
        <BrandTile className="size-14" />
        <p className="mt-4 text-xl font-semibold tracking-tight text-violet">{site.name}</p>
        <p className="mt-3 max-w-md text-base leading-relaxed text-orchid">{site.tagline}</p>

        {site.social.length > 0 && (
          <div className="mt-7 flex gap-3">
            {site.social.map((s) => (
              <SocialIcon key={s.label + s.href} label={s.label} href={s.href} />
            ))}
          </div>
        )}

        <div className="mt-14 grid w-full gap-10 border-t border-violet/10 pt-12 text-left sm:grid-cols-3">
          {site.menus.map((menu, index) => (
            <nav key={menu.label} aria-label={menu.label}>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-violet">{menu.label}</p>
              <ul className="space-y-2.5">
                {menu.items.map((item) => (
                  <li key={item.label + item.href}>
                    <SmartLink href={item.href} className="text-[0.95rem] text-orchid transition hover:text-violet">
                      {item.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
              {index === site.menus.length - 1 && site.menuNote && <p className="mt-5 text-[0.95rem] leading-relaxed text-orchid/80">{site.menuNote}</p>}
            </nav>
          ))}
        </div>

        <p className="mt-14 text-sm text-orchid/70">{site.copyright}</p>
      </div>
    </footer>
  );
}
