import type { MobileSection } from "../types";
import { IaHero } from "./pageHero";
import { GiantWord } from "./giant-word";

// The laptop's giant word (the same word in other languages, letters that swipe) is kept: it sits above the tagline.
export const WordHeroSection: MobileSection<"wordHero"> = ({ data, index }) => (
  <IaHero h1={index === 0} lead={<GiantWord words={data.words} />} heading={data.heading} text={data.text} actions={[{ label: data.primaryLabel, href: data.primaryHref }, { label: data.secondaryLabel, href: data.secondaryHref }]} />
);
