import type { MobileSection } from "../types";
import { PicCard, Section } from "../../app";
import { coverOf } from "@/lib/projects";

export const ProjectsSection: MobileSection<"projects"> = ({ data, id, extra }) => {
  const list = (extra.projects ?? []).filter((p) => !data.group || p.group === data.group);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {list.length === 0 ? (
        <p className="ma-intro">The projects will appear here soon.</p>
      ) : (
        <div className="ma-stack ma-grid2">
          {list.map((p) => <PicCard key={p.id} src={coverOf(p)} alt={p.title} kicker={p.category} title={p.title} text={p.summary} href={"/portfolio/" + p.slug} />)}
        </div>
      )}
    </Section>
  );
};
