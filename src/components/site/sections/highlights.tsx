import { IconTile } from "../icons";
import { Reveal } from "../reveal";
import { Chip, Frame } from "../ui";
import type { SectionComponent } from "./shared";

export const Highlights: SectionComponent<"highlights"> = ({ data }) => {
  if (data.items.length === 0) return null;
  return (
    <section id="highlights" className="py-24 sm:py-32">
      <Frame width="max-w-[960px]">
        <div className="flex flex-col items-center gap-6 px-4 py-12 text-center">
          <IconTile index={3} large />
          <Chip lines>{data.chip}</Chip>
        </div>
        <div className="grid grid-cols-2 border-t border-violet/10">
          {data.items.map((item, i) => (
            <Reveal key={i} delay={i * 90} className={`border-violet/10 px-3 py-10 text-center sm:py-14 ${i % 2 === 0 ? "border-r" : ""} ${i >= 2 ? "border-t" : ""}`}>
              <p className="text-vfade pb-2 text-[3.5rem] font-semibold leading-none tracking-[-0.05em] sm:text-[7rem] md:text-[9.5rem]">{item.value}</p>
              <p className="mt-2 text-base font-medium text-violet sm:text-2xl">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </Frame>
    </section>
  );
};
