import type { MobileSection } from "../types";
import { Section } from "../../app";
import { lines } from "../../app/text";

/** the tags as glass chips that wrap onto as many lines as they need (a name never breaks in the middle) */
export const TagsSection: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <p className="ma-s27 ma-s27-line ma-tgx ma-rvx">
      {lines(data.items).map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </p>
  </Section>
);
