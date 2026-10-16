import { AboutHero } from "../about/about-hero";
import { HeroBadges } from "../hero-badges";
import type { SectionComponent } from "./shared";

/** The first screen of the About page: words on a grid floor (see about/about-hero.tsx), with the recognitions above the words. */
export const AboutHeroSection: SectionComponent<"aboutHero"> = ({ data, site }) => (
  <div className="relative">
    <AboutHero chip={data.chip} heading={data.heading} text={data.text} />
    <HeroBadges badges={site.badges} />
  </div>
);
