import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

/** Vertical timeline: a glowing line down the middle, years on one side and glass cards on the other (stacked on phones). */
export const Timeline: SectionComponent<"timeline"> = ({ data }) => (
  <section id="journey" className="py-24 sm:py-32">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading} />
      <ol className="relative mx-auto mt-16 max-w-[880px]">
        <span aria-hidden className="absolute bottom-0 left-[17px] top-0 w-px bg-gradient-to-b from-transparent via-violet/35 to-transparent sm:left-1/2" />
        {data.items.map((item, i) => {
          const right = i % 2 === 0; // desktop: even items on the right, odd on the left
          return (
            <li key={i} className="relative grid grid-cols-[36px_1fr] gap-x-4 pb-10 last:pb-0 sm:grid-cols-[1fr_36px_1fr] sm:gap-x-6">
              <Reveal className={`col-start-2 sm:row-start-1 ${right ? "sm:col-start-3" : "sm:col-start-1 sm:text-right"}`}>
                <p className="text-vfade pb-1 text-[2.4rem] font-semibold leading-none tracking-[-0.04em] sm:text-5xl">{item.year}</p>
                <div className="card-glass mt-3 rounded-[19px] border border-violet/[0.12] p-5 text-sm leading-relaxed text-orchid backdrop-blur-md">{item.text}</div>
              </Reveal>
              <span
                aria-hidden
                className="absolute left-[11px] top-3 size-3.5 rounded-full bg-violet shadow-[0_0_0_5px_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.18),0_0_22px_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.7)] sm:static sm:col-start-2 sm:row-start-1 sm:mx-auto sm:mt-3"
              />
            </li>
          );
        })}
      </ol>
    </Wide>
  </section>
);
