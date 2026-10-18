import type { MobileSection } from "../types";
import { Section } from "../../app";
import { lines } from "../../app/text";

/** the tags as one quiet line of text, a dot between them */
export const TagsSection: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <p className="ma-s27 ma-s27-line ma-rvx">
      {lines(data.items).map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </p>
  </Section>
);
