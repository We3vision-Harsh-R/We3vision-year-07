import { ReasonsStack } from "../reasons-stack";
import { WhyBento } from "../modern/why-bento";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/** The reasons to choose us. Service pages ("modern"): a bento of cards. Others ("classic"): a check list that stays on the left while the reasons pass by. */
export const Advantages: SectionComponent<"advantages"> = ({ data, skin }) =>
  skin === "modern" ? (
    <section id="advantages" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split />
        <div className="mt-14">
          <WhyBento items={data.items} />
        </div>
      </div>
    </section>
  ) : (
    <section id="advantages" className="py-24 sm:py-32">
      <ReasonsStack chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} />
    </section>
  );
