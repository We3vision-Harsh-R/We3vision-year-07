import { IconTile } from "../icons";
import { GlanceCard } from "../highlights-scenes";
import { Chip, Frame } from "../ui";
import type { SectionComponent } from "./shared";

export const Highlights: SectionComponent<"highlights"> = ({ data }) => {
  if (data.items.length === 0) return null;
  return (
    <section id="highlights" className="py-24 sm:py-32">
      <Frame width="max-w-[1200px]">
        <div className="flex flex-col items-center gap-6 px-4 py-12 text-center">
          <IconTile index={3} large />
          <Chip lines>{data.chip}</Chip>
        </div>
        <div className="grid grid-cols-1 border-t border-violet/10 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item, i) => (
            <GlanceCard
              key={i}
              index={i}
              value={item.value}
              label={item.label}
              className={`border-violet/10 px-3 pb-10 pt-6 text-center sm:pb-14 ${i === 1 ? "border-t sm:border-t-0" : i >= 2 ? "border-t" : ""} ${i % 2 === 0 ? "sm:border-r" : ""} ${i > 0 ? "lg:border-t-0" : ""} ${i < 3 ? "lg:border-r" : ""}`}
            />
          ))}
        </div>
      </Frame>
    </section>
  );
};
