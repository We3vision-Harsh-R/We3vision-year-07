import { IconTile } from "../icons";
import { Reveal } from "../reveal";
import { Frame, Rich, paragraphs } from "../ui";
import type { SectionComponent } from "./shared";

export const Story: SectionComponent<"story"> = ({ data }) => (
  <section id="about" className="py-24 sm:py-32">
    <Frame>
      <div className="px-6 py-10 sm:px-10">
        <IconTile large />
        <Reveal className="mt-8 space-y-8">
          {paragraphs(data.body).map((p, i) => (
            <p key={i} className="text-[1.6rem] leading-[1.35] tracking-[-0.01em] text-orchid sm:text-[2.1rem]">
              <Rich text={p} />
            </p>
          ))}
        </Reveal>
      </div>
    </Frame>
  </section>
);
