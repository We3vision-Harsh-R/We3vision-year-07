import { IndustriesCity } from "../industries-city";
import { IndustriesRoad } from "../industries-road";
import { DEFAULT_VARIANT, VARIANTS } from "../modern/map-variants";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/**
 * The industries as a small 3D city, every industry with its own district. Service
 * pages ("modern" skin): the same city, but the car drives straight ahead on a road of its own (straight, a soft wave or a stepped road, seen
 * from a different side on every page); it never turns back. The home page has the straight one, a fifth smaller. Other classic pages (Brand
 * Design): the ring-road city as it was.
 */
export const Industries: SectionComponent<"industries"> = ({ data, skin, page }) => {
  const v = (page && VARIANTS[page]) || DEFAULT_VARIANT;
  return (
    <section id="industries" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split={skin === "modern" || page === "home"} />
      </div>
      <div className="mt-16">
        {skin === "modern" ? (
          <IndustriesRoad items={data.items} road={v.road} ang={v.ang} />
        ) : page === "home" ? (
          // home: the same city, but the car drives straight along one road (no turn back), 20% smaller than before (1.1 -> 0.88)
          <IndustriesRoad items={data.items} road="straight" ang={-34} zoom={0.88} />
        ) : (
          <IndustriesCity items={data.items} />
        )}
      </div>
    </section>
  );
};
