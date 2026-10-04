import { ICONS } from "../icons";
import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

export const Advantages: SectionComponent<"advantages"> = ({ data }) => (
  <section id="advantages" className="py-24 sm:py-32">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
      <div className="mx-auto mt-16 grid max-w-[860px] gap-x-16 gap-y-12 sm:grid-cols-2">
        {data.items.map((item, i) => {
          const Icon = ICONS[(i + 2) % ICONS.length];
          return (
            <Reveal key={i} delay={(i % 2) * 90}>
              <article>
                <div className="flex items-center gap-3">
                  <Icon className="size-5 shrink-0 text-violet" />
                  <h3 className="text-vfade pb-1 text-[1.9rem] font-semibold leading-tight tracking-[-0.03em]">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-orchid">{item.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Wide>
  </section>
);
