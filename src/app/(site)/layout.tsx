import { Background } from "@/components/site/background";
import { FloatingNav } from "@/components/site/floating-nav";
import { Footer } from "@/components/site/footer";
import { LateExtras } from "@/components/site/late-extras";
import { LogoMark } from "@/components/site/logo-mark";
import { MobileLauncher } from "@/components/site/mobile/launcher";
import { SiteScrollbar } from "@/components/site/site-scrollbar";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getSiteSettings } from "@/lib/cms/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings();
  return (
    <div className="relative overflow-x-clip">
      <MobileLauncher />
      <SmoothScroll />
      <SiteScrollbar />
      <LateExtras />
      <Background />
      <LogoMark name={site.name} />
      <main>{children}</main>
      <Footer site={site} />
      <FloatingNav
        items={site.nav}
        mega={{ nav: site.nav, menus: site.menus, title: site.megaTitle, text: site.megaText, cta: site.megaCta, ctaHref: site.megaCtaHref, badges: site.badges, social: site.social }}
      />
    </div>
  );
}
