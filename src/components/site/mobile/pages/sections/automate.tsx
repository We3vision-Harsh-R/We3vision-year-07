import type { MobileSection } from "../types";
import { GroupedList, ListRow, Section } from "../../app";

export const AutomateSection: MobileSection<"automate"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <GroupedList header={data.beforeLabel + " → " + data.afterLabel}>
      {data.items.map((x, i) => <ListRow key={i} title={x.problem} text={x.solution} />)}
    </GroupedList>
  </Section>
);
