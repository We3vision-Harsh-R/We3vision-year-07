import "../globals.css";
import { Background } from "@/components/site/background";
import { FestLayer } from "@/components/site/fest/fest-layer";
import { FloatingNav } from "@/components/site/floating-nav";
import { Footer } from "@/components/site/footer";
import { LateExtras } from "@/components/site/late-extras";
import { LogoMark } from "@/components/site/logo-mark";
import { SiteScrollbar } from "@/components/site/site-scrollbar";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getSiteSettings } from "@/lib/cms/queries";
import { anyFest, festBootScript } from "@/lib/fest";
import { getFestConfig } from "@/lib/fest-server";
import { RootShell, baseMetadata } from "@/lib/root-shell";

// ROOT LAYOUT of the laptop website (see src/lib/root-shell.tsx): the only one that loads globals.css and the desktop scenes.
// LateExtras (cursor, colour picker, pause of off-screen figures) is loaded after the first paint (optimize branch).
export const metadata = baseMetadata;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, fest] = await Promise.all([getSiteSettings(), getFestConfig()]);
  const festOn = anyFest(fest);
  return (
    <RootShell boot={festOn ? festBootScript(fest) : undefined}>
      <div className="relative overflow-x-clip">
        <a href="#main-content" className="skp-link">
          Skip to content
        </a>
        <SmoothScroll />
        <SiteScrollbar />
        <LateExtras />
        <Background />
        {/* a festival theme (Admin > Fest): RootShell puts it on <html> before the first paint (boot), these are its decorations. While developing, FestLayer is always there: an address with ?festtest shows every effect (the check is removed from the production build) */}
        {(festOn || process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_FEST_PREVIEW === "1") && <FestLayer cfg={fest} />}
        <LogoMark name={site.name} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer site={site} />
        <FloatingNav
          items={site.nav}
          mega={{ nav: site.nav, menus: site.menus, title: site.megaTitle, text: site.megaText, cta: site.megaCta, ctaHref: site.megaCtaHref, badges: site.badges, social: site.social }}
        />
      </div>
    </RootShell>
  );
}
