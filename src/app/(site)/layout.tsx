import "../globals.css";
import "@/styles/home-mobile.css";
import "@/styles/phone-space.css";
import "@/styles/service-hero-mobile.css";
import "@/styles/nav-bar.css";
import "@/styles/phone-speed.css";
import { Background } from "@/components/site/background";
import { FestLive } from "@/components/site/fest/fest-live";
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

// the colour picker is switched off in Admin > Settings: a colour a visitor saved earlier is not put on the page before the first paint
const PICKER_OFF_BOOT = `(function(){var r=document.documentElement.style;r.removeProperty("--th");r.removeProperty("--ts");})();`;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, fest] = await Promise.all([getSiteSettings(), getFestConfig()]);
  const festOn = anyFest(fest);
  return (
    <RootShell boot={[festOn ? festBootScript(fest) : "", site.picker.show === "off" ? PICKER_OFF_BOOT : ""].join("") || undefined}>
      <div className="relative overflow-x-clip">
        <a href="#main-content" className="skp-link">
          Skip to content
        </a>
        <SmoothScroll />
        <SiteScrollbar />
        <LateExtras picker={site.picker} />
        <Background />
        {/* a festival theme (Admin > Fest): RootShell puts it on <html> before the first paint (boot); FestLive keeps the settings fresh (a change in
            the admin panel shows without a reload) and loads the decorations only once a festival is on. While developing (or in a preview build)
            the layer is always there: an address with ?festtest shows every effect */}
        <FestLive initial={fest} force={process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_FEST_PREVIEW === "1"} />
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
