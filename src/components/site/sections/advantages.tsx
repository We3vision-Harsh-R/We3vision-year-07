import { ReasonsStack } from "../reasons-stack";
import type { SectionComponent } from "./shared";

/** The reasons to choose us: a check list that stays on the left while the reasons pass by on the right. */
export const Advantages: SectionComponent<"advantages"> = ({ data }) => (
  <section id="advantages" className="py-24 sm:py-32">
    <ReasonsStack chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} />
  </section>
);
