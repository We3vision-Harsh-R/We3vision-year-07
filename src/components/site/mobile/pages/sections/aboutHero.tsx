import type { MobileSection } from "../types";
import { HeroBlock } from "../blocks";

export const AboutHeroSection: MobileSection<"aboutHero"> = ({ data, index }) => (
  <HeroBlock index={index} chip={data.chip} heading={data.heading} text={data.text} actions={[{ label: data.primaryLabel, href: data.primaryHref }, { label: data.secondaryLabel, href: data.secondaryHref }]} />
);
