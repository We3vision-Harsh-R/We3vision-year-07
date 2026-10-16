import type { MobileSection } from "../types";
import { Section, Stats } from "../../app";

export const HighlightsSection: MobileSection<"highlights"> = ({ data, id }) => (
  <Section id={id} chip={data.chip}>
    <Stats items={data.items} />
  </Section>
);
