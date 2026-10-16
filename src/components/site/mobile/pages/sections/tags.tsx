import type { MobileSection } from "../types";
import { Cloud, Section } from "../../app";
import { lines } from "../../app/text";

export const TagsSection: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <Cloud items={lines(data.items)} />
  </Section>
);
