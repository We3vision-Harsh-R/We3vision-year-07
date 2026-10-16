import { AboutChapters } from "../about/about-chapters";
import type { SectionComponent } from "./shared";

/** The story of the company as chapters, and the panda (see about/about-chapters.tsx). */
export const AboutChaptersSection: SectionComponent<"aboutChapters"> = ({ data }) => (
  <AboutChapters
    chip={data.chip}
    heading={data.heading}
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
