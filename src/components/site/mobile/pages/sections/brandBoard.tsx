import type { MobileSection } from "../types";
import { Button, Card, GroupedList, ListRow, Section } from "../../app";
import { Rich, pairs } from "../../app/text";

export const BrandBoardSection: MobileSection<"brandBoard"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.lead}>
    {data.body && <Card><div className="ma-prose"><p><Rich text={data.body} /></p></div></Card>}
    {pairs(data.points).length > 0 && (
      <div className="ma-gap">
        <GroupedList header={data.listIntro} footer={data.note}>
          {pairs(data.points).map((p, i) => <ListRow key={i} title={p.name} text={p.text} />)}
        </GroupedList>
      </div>
    )}
    {data.ctaLabel && (
      <div className="ma-actions"><Button href={data.ctaHref || "#contact"} block>{data.ctaLabel}</Button></div>
    )}
  </Section>
);
