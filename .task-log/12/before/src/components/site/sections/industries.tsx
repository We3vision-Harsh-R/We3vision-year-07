import { IndustriesCity } from "../industries-city";
import { IndustriesMap } from "../modern/industries-map";
import { DEFAULT_VARIANT, VARIANTS } from "../modern/map-variants";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/**
 * The industries. Service pages ("modern" skin): a small map where somebody walks, cycles or drives along a road of their own from industry
 * to industry (the road, the traveller and the scenery are different on every page). The others ("classic"): a 3D city with a ring road
 * and a car.
 */
export const Industries: SectionComponent<"industries"> = ({ data, skin, page }) => (
  <section id="industries" className="py-24 sm:py-32">
    <div className="mx-auto w-full max-w-[1120px] px-4">
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split={skin === "modern" || page === "home"} />
    </div>
    <div className="mt-16">
      {skin === "modern" ? <IndustriesMap items={data.items} variant={(page && VARIANTS[page]) || DEFAULT_VARIANT} /> : <IndustriesCity items={data.items} />}
    </div>
  </section>
);
