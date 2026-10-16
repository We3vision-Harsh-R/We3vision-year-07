import { coverOf } from "@/lib/projects";
import { GlowEdge } from "../glow-edge";
import { Img } from "../img";
import { Reveal } from "../reveal";
import { SmartLink } from "../smart-link";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

/** The projects of the admin panel as cards (picture, label, name, short text); every card opens the page of the project. */
export const ProjectsGrid: SectionComponent<"projects"> = ({ data, sectionId, projects }) => {
  const list = (projects ?? []).filter((p) => !data.group || p.group === data.group);
  return (
    <section id={sectionId ?? "projects"} className="py-24 sm:py-32">
      <Wide>
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        {list.length === 0 ? (
          <p className="mt-16 text-center text-base text-orchid">The projects will appear here soon.</p>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90} className="h-full">
                <SmartLink
                  href={`/portfolio/${p.slug}`}
                  className="bglow card-glass group relative block h-full overflow-hidden rounded-[19px] border border-violet/[0.08] transition duration-300 hover:-translate-y-1 hover:border-violet/30"
                >
                  <GlowEdge />
                  <div className="relative aspect-[4/3] overflow-hidden bg-dusk">
                    <Img src={coverOf(p)} alt={p.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
                    {p.category && <span className="absolute left-4 top-4 rounded-full border border-violet/30 bg-void/70 px-3.5 py-1 text-sm font-medium text-violet backdrop-blur">{p.category}</span>}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold leading-snug tracking-[-0.01em] text-violet">{p.title}</h3>
                    {p.summary && <p className="mt-2 text-base leading-relaxed text-orchid">{p.summary}</p>}
                  </div>
                </SmartLink>
              </Reveal>
            ))}
          </div>
        )}
      </Wide>
    </section>
  );
};
