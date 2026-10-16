import { Glance } from "../about/glance";
import { GlanceMin } from "../glance-min";
import type { SectionComponent } from "./shared";

/**
 * "At a glance". Home: minimal, a row of figures on thin lines that draw themselves and count up (see glance-min.tsx). Others (About):
 * a small dashboard of glass tiles with little pictures that draw themselves (see about/glance.tsx).
 */
export const Highlights: SectionComponent<"highlights"> = ({ data, page }) => {
  if (data.items.length === 0) return null;
  return (
    <section id="highlights" className="py-24 sm:py-32">
      {page === "home" ? <GlanceMin chip={data.chip} items={data.items} /> : <Glance chip={data.chip} items={data.items} />}
    </section>
  );
};
