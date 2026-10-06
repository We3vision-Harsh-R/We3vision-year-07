import { ArtTile } from "../art";
import { IconTile } from "../icons";
import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

const title = "text-vfade pb-1 whitespace-pre-line text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.5rem]";

export const Strengths: SectionComponent<"strengths"> = ({ data }) => {
  const [first, ...rest] = data.items;
  return (
    <section id="strengths" className="py-24 sm:py-32">
      <Wide>
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        <div className="mt-16 space-y-6">
          {first && (
            <Reveal>
              <article className="card-glass grid gap-8 rounded-[19px] border border-violet/[0.08] p-6 sm:p-10 md:grid-cols-2 md:items-center md:gap-12">
                <div>
                  <IconTile index={0} />
                  <h3 className={`${title} mt-10 md:mt-24`}>{first.title}</h3>
                  <p className="mt-4 text-base leading-[1.7] text-orchid">{first.description}</p>
                </div>
                <div className="mx-auto w-full max-w-[340px]">
                  <ArtTile index={0} />
                </div>
              </article>
            </Reveal>
          )}
          {rest.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((item, i) => (
                <Reveal key={i} delay={i * 100} className="h-full">
                  <article className="card-glass flex h-full flex-col rounded-[19px] border border-violet/[0.08] p-6 sm:p-10">
                    <IconTile index={i + 1} />
                    <h3 className={`${title} mt-8`}>{item.title}</h3>
                    <p className="mb-8 mt-4 text-base leading-[1.7] text-orchid">{item.description}</p>
                    <div className="mt-auto">
                      <ArtTile index={i + 1} />
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Wide>
    </section>
  );
};
