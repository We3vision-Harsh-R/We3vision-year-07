import "../globals.css";
import { Background } from "@/components/site/background";
import { FloatingNav } from "@/components/site/floating-nav";
import { Footer } from "@/components/site/footer";
import { LateExtras } from "@/components/site/late-extras";
import { LogoMark } from "@/components/site/logo-mark";
import { SiteScrollbar } from "@/components/site/site-scrollbar";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getSiteSettings } from "@/lib/cms/queries";
import { RootShell, baseMetadata } from "@/lib/root-shell";

// ROOT LAYOUT of the laptop website (see src/lib/root-shell.tsx): the only one that loads globals.css and the desktop scenes.
// LateExtras (cursor, colour picker, pause of off-screen figures) is loaded after the first paint (optimize branch).
export const metadata = baseMetadata;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings();
  return (
    <RootShell>
      <div className="relative overflow-x-clip">
        <a href="#main-content" className="skp-link">
          Skip to content
        </a>
        <SmoothScroll />
        <SiteScrollbar />
        <LateExtras />
        <Background />
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
