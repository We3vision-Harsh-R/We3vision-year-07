import type { MobileSection } from "../types";
import { Card, Section, Tabs } from "../../app";
import { oneLine } from "../../app/text";

export const IndustriesSection: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <Tabs tabs={data.items.map((x) => ({ label: oneLine(x.name), content: <Card><h3>{x.name}</h3><p>{x.description}</p></Card> }))} />
  </Section>
);
