import { GlanceOrbit } from "../lazy";
import type { SectionComponent } from "./shared";

/**
 * "At a glance" (home and About): a ring that counts the years with the other facts as cards around it (see glance-orbit.tsx; the plain row of
 * glance-min.tsx when the first two facts are not numbers).
 */
export const Highlights: SectionComponent<"highlights"> = ({ data }) => {
  if (data.items.length === 0) return null;
  return (
    <section id="highlights" className="py-24 sm:py-32">
      <GlanceOrbit chip={data.chip} items={data.items} />
    </section>
  );
};
