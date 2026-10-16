import { IndustriesCity } from "../industries-city";
import { IndustriesRoad } from "../industries-road";
import { DEFAULT_VARIANT, VARIANTS } from "../modern/map-variants";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/**
 * The industries as a small 3D city, every industry with its own district. Home and the other classic pages: the city with a ring road. Service
 * pages ("modern" skin): the same city, but the car drives straight ahead on a road of its own (straight, a soft wave or a stepped road, seen
 * from a different side on every page); it never turns back.
 */
export const Industries: SectionComponent<"industries"> = ({ data, skin, page }) => {
  const v = (page && VARIANTS[page]) || DEFAULT_VARIANT;
  return (
    <section id="industries" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split={skin === "modern" || page === "home"} />
      </div>
      <div className="mt-16">{skin === "modern" ? <IndustriesRoad items={data.items} road={v.road} ang={v.ang} /> : <IndustriesCity items={data.items} />}</div>
    </section>
  );
};
