import { Background } from "@/components/site/background";
import { CustomCursor } from "@/components/site/custom-cursor";
import { FloatingNav } from "@/components/site/floating-nav";
import { Footer } from "@/components/site/footer";
import { LogoMark } from "@/components/site/logo-mark";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getSiteSettings } from "@/lib/cms/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteSettings();
  return (
    <div className="relative overflow-x-clip">
      <SmoothScroll />
      <CustomCursor />
      <Background />
      <LogoMark name={site.name} />
      <main>{children}</main>
      <Footer site={site} />
      <FloatingNav items={site.nav} />
    </div>
  );
}
