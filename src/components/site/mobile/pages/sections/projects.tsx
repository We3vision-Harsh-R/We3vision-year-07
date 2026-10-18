import type { MobileSection } from "../types";
import { AppLink, Pic, Section } from "../../app";
import { coverOf } from "@/lib/projects";

/** the projects: a picture and its words under it, no box around them (two columns on a tablet) */
export const ProjectsSection: MobileSection<"projects"> = ({ data, id, extra }) => {
  const list = (extra.projects ?? []).filter((p) => !data.group || p.group === data.group);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {list.length === 0 ? (
        <p className="ma-intro">The projects will appear here soon.</p>
      ) : (
        <div className="ma-s27 ma-s27-works">
          {list.map((p) => (
            <AppLink key={p.id} href={"/portfolio/" + p.slug} className="ma-s27-work">
              <Pic src={coverOf(p)} alt={p.title} />
              <span className="ma-s27-wb">
                {p.category && <small>{p.category}</small>}
                <b>{p.title}</b>
                {p.summary && <span>{p.summary}</span>}
              </span>
            </AppLink>
          ))}
        </div>
      )}
    </Section>
  );
};
