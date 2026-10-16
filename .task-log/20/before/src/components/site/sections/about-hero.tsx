import { AboutHero } from "../about/about-hero";
import type { SectionComponent } from "./shared";

/** The first screen of the About page: words on a grid floor (see about/about-hero.tsx). */
export const AboutHeroSection: SectionComponent<"aboutHero"> = ({ data }) => <AboutHero chip={data.chip} heading={data.heading} text={data.text} primaryLabel={data.primaryLabel} primaryHref={data.primaryHref} secondaryLabel={data.secondaryLabel} secondaryHref={data.secondaryHref} />;
