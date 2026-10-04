import { IndustriesTabs } from "../industries-tabs";
import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

export const Industries: SectionComponent<"industries"> = ({ data }) => (
  <section id="industries" className="py-24 sm:py-32">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
      <Reveal className="mt-14">
        <IndustriesTabs items={data.items} />
      </Reveal>
    </Wide>
  </section>
);
