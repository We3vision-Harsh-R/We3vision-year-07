import { GlowEdge } from "../glow-edge";
import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** People cards: round monogram avatar (initials), name and role. */
export const Team: SectionComponent<"team"> = ({ data }) => (
  <section id="team" className="py-24 sm:py-32">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading} />
      <div className="mx-auto mt-16 grid max-w-[860px] gap-5 sm:grid-cols-3">
        {data.members.map((m, i) => (
          <Reveal key={i} delay={i * 90} className="h-full">
            <article className="bglow card-glass flex h-full flex-col items-center rounded-[19px] border border-violet/[0.12] p-8 text-center backdrop-blur-md">
              <GlowEdge />
              <span className="grid size-24 place-items-center rounded-full border border-violet/25 bg-[linear-gradient(180deg,hsl(calc(var(--th)_+_351.38)_calc(40.21%_*_var(--ts))_19.02%),hsl(calc(var(--th)_+_346)_calc(72.22%_*_var(--ts))_7.06%))] shadow-[inset_0_1px_0_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.3),0_14px_40px_hsl(calc(var(--th)_+_343.69)_calc(68.42%_*_var(--ts))_37.25%_/_0.35)]">
                <span className="text-vfade text-3xl font-semibold tracking-tight">{initials(m.name)}</span>
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-violet">{m.name}</h3>
              <p className="mt-1.5 text-sm text-orchid">{m.role}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Wide>
  </section>
);
