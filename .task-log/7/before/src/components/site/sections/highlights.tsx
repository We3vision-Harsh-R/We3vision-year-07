import { Glance } from "../about/glance";
import type { SectionComponent } from "./shared";

/** "At a glance": a small dashboard of glass tiles with little pictures that draw themselves (see about/glance.tsx). */
export const Highlights: SectionComponent<"highlights"> = ({ data }) => {
  if (data.items.length === 0) return null;
  return (
    <section id="highlights" className="py-24 sm:py-32">
      <Glance chip={data.chip} items={data.items} />
    </section>
  );
};
