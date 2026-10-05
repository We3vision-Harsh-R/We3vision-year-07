import { IndustriesOrbit } from "../industries-orbit";
import { Reveal } from "../reveal";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

export const Industries: SectionComponent<"industries"> = ({ data }) => (
  <section id="industries" className="py-24 sm:py-32">
    <div className="mx-auto w-full max-w-[1120px] px-4">
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
      <Reveal className="mt-16">
        <IndustriesOrbit items={data.items} />
      </Reveal>
    </div>
  </section>
);
