import type { MobileSection } from "../types";
import { GroupedList, ListRow, Section } from "../../app";

export const TeamSection: MobileSection<"team"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <GroupedList>
      {data.members.map((m, i) => (
        <ListRow key={i} title={m.name} text={m.role} icon={m.name.trim().charAt(0).toUpperCase()} />
      ))}
    </GroupedList>
  </Section>
);
