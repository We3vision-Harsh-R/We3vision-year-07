import { IndustriesCity } from "../industries-city";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/** The industries as districts of a small 3D city: a car drives from district to district while the page scrolls. */
export const Industries: SectionComponent<"industries"> = ({ data }) => (
  <section id="industries" className="py-24 sm:py-32">
    <div className="mx-auto w-full max-w-[1120px] px-4">
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
    </div>
    <div className="mt-16">
      <IndustriesCity items={data.items} />
    </div>
  </section>
);
