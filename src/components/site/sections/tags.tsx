import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

/** A cloud of small rounded tags (tools, technologies). */
export const Tags: SectionComponent<"tags"> = ({ data }) => {
  const items = data.items.split("\n").map((t) => t.trim()).filter(Boolean);
  return (
    <section id="tools" className="py-24 sm:py-32">
      <Wide>
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        <Reveal delay={90} className="mx-auto mt-14 flex max-w-[820px] flex-wrap justify-center gap-3">
          {items.map((item) => (
            <span key={item} className="card-glass rounded-full border border-violet/[0.12] px-5 py-2.5 text-sm text-violet/90">
              {item}
            </span>
          ))}
        </Reveal>
      </Wide>
    </section>
  );
};
