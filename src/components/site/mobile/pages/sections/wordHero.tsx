import type { MobileSection } from "../types";
import { Cloud } from "../../app";
import { HeroBlock } from "../blocks";
import { lines } from "../../app/text";

export const WordHeroSection: MobileSection<"wordHero"> = ({ data, index }) => (
  <HeroBlock index={index} heading={data.heading} text={data.text} actions={[{ label: data.primaryLabel, href: data.primaryHref }, { label: data.secondaryLabel, href: data.secondaryHref }]}>
    {lines(data.words).length > 0 && <div className="ma-gap"><Cloud items={lines(data.words)} /></div>}
  </HeroBlock>
);
