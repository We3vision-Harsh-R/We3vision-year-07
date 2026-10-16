import type { MobileSection } from "../types";
import { Card, Cloud, Section, Stepper } from "../../app";
import { Rich, lines } from "../../app/text";

export const TimelineSection: MobileSection<"timeline"> = ({ data, id }) => {
  const names = lines(data.names);
  const teams = lines(data.teams);
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      <Card><Stepper steps={data.items.map((x) => ({ label: x.year, text: x.text }))} /></Card>
      {names.length > 0 && (
        <div className="ma-gap"><Cloud items={data.partnerName ? [...names, data.partnerName + " · " + data.partnerYear] : names} /></div>
      )}
      {(data.goalTitle || data.goalText) && (
        <div className="ma-gap">
          <Card tone="tint">
            {data.goalTitle && <h3>{data.goalTitle}</h3>}
            {data.goalText && <p><Rich text={data.goalText} /></p>}
            {teams.length > 0 && <div className="ma-gap"><Cloud items={teams} /></div>}
          </Card>
        </div>
      )}
    </Section>
  );
};
