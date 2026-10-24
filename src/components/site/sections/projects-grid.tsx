import { coverOf } from "@/lib/projects";
import { SectionHead, Wide } from "../ui";
import { ProjectsBoard } from "./projects-board";
import type { SectionComponent } from "./shared";

/** The projects of the admin panel: a board with filters (category chips + search) and a bento grid of cards; every card opens the page of the project. */
export const ProjectsGrid: SectionComponent<"projects"> = ({ data, sectionId, projects }) => {
  const list = (projects ?? []).filter((p) => !data.group || p.group === data.group);
  return (
    <section id={sectionId ?? "projects"} className="py-24 sm:py-32">
      <Wide>
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        {list.length === 0 ? (
          <p className="mt-16 text-center text-base text-orchid">The projects will appear here soon.</p>
        ) : (
          <ProjectsBoard projects={list.map((p) => ({ id: p.id, slug: p.slug, title: p.title, category: p.category, summary: p.summary, cover: coverOf(p) }))} />
        )}
      </Wide>
    </section>
  );
};
