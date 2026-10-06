import { Reveal } from "../reveal";
import { TechSpace } from "../tech-space";
import type { SectionComponent } from "./shared";

/** The tools and technologies of a service as constellations in space, all on one screen; a pop-up with what can be built when you hover one. */
export const Tags: SectionComponent<"tags"> = ({ data }) => {
  const items = data.items.split("\n").map((t) => t.trim()).filter(Boolean);
  return (
    <section id="tools" className="ts">
      <Reveal className="ts-head">
        <span className="inline-flex items-center rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-sm font-medium text-violet shadow-[0_0_24px_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.15)]">{data.chip}</span>
        <h2 className="text-vfade mx-auto mt-5 max-w-[900px] whitespace-pre-line pb-1 text-[2rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[2.6rem] lg:text-[3.25rem]">{data.heading}</h2>
        {data.intro && <p className="mx-auto mt-4 max-w-[560px] text-base leading-relaxed text-orchid">{data.intro}</p>}
      </Reveal>
      <TechSpace items={items} />
    </section>
  );
};
