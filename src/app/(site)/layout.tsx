import "../globals.css";
import "@/styles/home-mobile.css";
import "@/styles/menu-phone-a.css";
import "@/styles/phone-space.css";
import "@/styles/service-hero-mobile.css";
import "@/styles/nav-bar.css";
import "@/styles/menu-phone-b.css";
import "@/styles/phone-speed.css";
import "@/styles/ux-fixes.css";
import "@/styles/ux-auto.css";
import "@/styles/ux-auto-phone.css";
import "@/styles/phone-glass.css";
import { Background } from "@/components/site/background";
import { FloatingNav } from "@/components/site/floating-nav";
import { Footer } from "@/components/site/footer";
import { LateExtras } from "@/components/site/late-extras";
import { LogoMark } from "@/components/site/logo-mark";
import { SiteScrollbar } from "@/components/site/site-scrollbar";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { HomeGlide } from "@/components/site/home/home-glide";
import { getSiteSettings } from "@/lib/cms/queries";
import { getPresenceConfig } from "@/lib/presence-server";
import { RootShell, baseMetadata } from "@/lib/root-shell";

// ROOT LAYOUT of the laptop website (see src/lib/root-shell.tsx): the only one that loads globals.css and the desktop scenes.
// LateExtras (cursor, colour picker, pause of off-screen figures) is loaded after the first paint (optimize branch).
export const metadata = baseMetadata;

// the colour picker is switched off in Admin > Settings: a colour a visitor saved earlier is not put on the page before the first paint
const PICKER_OFF_BOOT = `(function(){var r=document.documentElement.style;r.removeProperty("--th");r.removeProperty("--ts");})();`;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, presence] = await Promise.all([getSiteSettings(), getPresenceConfig()]);
  // a first-time visitor is asked for a name only (components/site/presence.tsx): the colour card then opens only from its small round button
  const picker = presence.askName && site.picker.show !== "off" ? { ...site.picker, show: "button" } : site.picker;
  return (
    <RootShell htmlClass="sb-pre" boot={site.picker.show === "off" ? PICKER_OFF_BOOT : undefined}>
      <div className="relative overflow-x-clip">
        <a href="#main-content" className="skp-link">
          Skip to content
        </a>
        <SmoothScroll />
        <HomeGlide />
        <SiteScrollbar />
        <LateExtras picker={picker} />
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
