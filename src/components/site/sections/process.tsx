import { Reveal } from "../reveal";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

const lines = (text: string) => text.split("\n").map((t) => t.trim()).filter(Boolean);

/** Numbered steps: a big number, the step title and text, and small tags on the right. */
export const Process: SectionComponent<"process"> = ({ data }) => (
  <section id="process" className="py-24 sm:py-32">
    <div className="mx-auto w-full max-w-[1100px] px-4">
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
      <ol className="mt-16 divide-y divide-violet/10 border-y border-violet/10">
        {data.items.map((step, i) => (
          <li key={i}>
            <Reveal delay={60}>
              <div className="grid gap-6 py-10 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,0.9fr)] md:items-start md:gap-10">
                <span className="text-vfade text-[3.5rem] font-semibold leading-none tracking-[-0.04em]">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-violet">{step.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-orchid">{step.text}</p>
                </div>
                {lines(step.points).length > 0 && (
                  <ul className="flex flex-wrap gap-2 md:justify-end">
                    {lines(step.points).map((tag) => (
                      <li key={tag} className="rounded-full border border-violet/20 bg-violet/[0.06] px-3.5 py-1.5 text-xs text-violet/90">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
