import { ReasonsStack, AiWhy } from "../lazy";
import { WhyBento } from "../lazy";
import { WhyVariant } from "../lazy";
import { variantOf } from "../modern/variant-table";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/** The reasons to choose us. Service pages ("modern"): a bento of cards. Others ("classic"): a check list that stays on the left while the reasons pass by. */
export const Advantages: SectionComponent<"advantages"> = ({ data, skin, page, sectionId }) => {
  if (page === "ai") return <AiWhy chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} />;
  // a second block of this kind on a page (a second block on the same page) has its own anchor and, so that two blocks never look alike, its own design
  const dom = sectionId === "open-world" ? "open-world" : "advantages";
  const base = variantOf(page, "why");
  const v = base === null ? null : sectionId === "open-world" ? (base + 3) % 8 : base;
  // the service pages: every page shows its reasons in its own design (modern/variant-table.ts)
  if (v !== null && v > 0) {
    return (
      <section id={dom} className="py-24 sm:py-32">
        <div className="mx-auto w-full max-w-[1120px] px-4">
          <WhyVariant variant={v} chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} />
        </div>
      </section>
    );
  }
  return skin === "modern" ? (
    <section id={dom} className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split />
        <div className="mt-14">
          <WhyBento items={data.items} />
        </div>
      </div>
    </section>
  ) : (
    <section id={dom} className="py-24 sm:py-32">
      <ReasonsStack chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} />
    </section>
  );
};
