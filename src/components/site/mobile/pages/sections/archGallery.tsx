import type { MobileSection } from "../types";
import { AppLink, Gallery, Pic, Section } from "../../app";
import { coverOf } from "@/lib/projects";

// Photos of client work: the projects of a group (Admin > Projects) when the section names a group, otherwise the photos written in the section.
// A row that scrolls sideways and snaps; the words sit under each photo, no box.
export const ArchGallerySection: MobileSection<"archGallery"> = ({ data, id, extra }) => {
  const group = (extra.projects ?? []).filter((p) => data.group && p.group === data.group);
  const list =
    group.length > 0
      ? group.map((p) => ({ key: String(p.id), src: coverOf(p), title: p.title, kicker: p.category, text: p.summary, href: "/portfolio/" + p.slug }))
      : data.items.map((p, i) => ({ key: String(i), src: p.image, title: p.title, kicker: p.category, text: p.text, href: "" }));
  return (
    <Section id={id}>
      <div className="ma-s27 ma-s27-gal">
        <Gallery label="Our work">
          {list.map((p) => (
            <AppLink key={p.key} href={p.href} className="ma-s27-work">
              <Pic src={p.src || undefined} alt={p.title} ratio="3 / 4" />
              <span className="ma-s27-wb">
                {p.kicker && <small>{p.kicker}</small>}
                <b>{p.title}</b>
                {p.text && <span>{p.text}</span>}
              </span>
            </AppLink>
          ))}
        </Gallery>
      </div>
    </Section>
  );
};
