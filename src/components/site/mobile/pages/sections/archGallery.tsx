import type { MobileSection } from "../types";
import { Gallery, PicCard, Section } from "../../app";
import { coverOf } from "@/lib/projects";

// Photos of client work: the projects of a group (Admin > Projects) when the section names a group, otherwise the photos written in the section.
export const ArchGallerySection: MobileSection<"archGallery"> = ({ data, id, extra }) => {
  const group = (extra.projects ?? []).filter((p) => data.group && p.group === data.group);
  return (
    <Section id={id}>
      <Gallery label="Our work">
        {group.length > 0
          ? group.map((p) => <PicCard key={p.id} src={coverOf(p)} alt={p.title} ratio="3 / 4" kicker={p.category} title={p.title} text={p.summary} href={"/portfolio/" + p.slug} />)
          : data.items.map((p, i) => <PicCard key={i} src={p.image} alt={p.title} ratio="3 / 4" kicker={p.category} title={p.title} text={p.text} />)}
      </Gallery>
    </Section>
  );
};
