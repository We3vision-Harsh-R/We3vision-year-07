import { AboutWorld } from "../about/about-world";
import type { SectionComponent } from "./shared";

/** The 3D story of the About page (see about/about-world.tsx). */
export const AboutWorldSection: SectionComponent<"aboutWorld"> = ({ data }) => (
  <AboutWorld
    hero={{ chip: data.hero.chip, heading: data.hero.heading, text: data.hero.text, primaryLabel: data.hero.primaryLabel, primaryHref: "#top", secondaryLabel: data.hero.secondaryLabel, secondaryHref: data.hero.secondaryHref }}
    chapters={data.chapters}
    meet={{
      chip: data.meet.chip,
      heading: data.meet.heading,
      text: data.meet.text,
      tips: data.meet.tips
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    }}
  />
);
