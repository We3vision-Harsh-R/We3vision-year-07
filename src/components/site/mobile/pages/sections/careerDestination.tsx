import type { MobileSection } from "../types";
import { Button, Card, GroupedList, ListRow, Section } from "../../app";

export const CareerDestinationSection: MobileSection<"careerDestination"> = ({ data, id, extra }) => {
  const jobs = extra.jobs ?? [];
  return (
    <>
      <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
        {(data.station || data.address) && (
          <Card tone="tint">
            {data.station && <p className="ma-kicker">{data.station}</p>}
            {data.address && <p>{data.address}</p>}
          </Card>
        )}
      </Section>
      {data.jobsHeading && (
        <Section title={data.jobsHeading} intro={data.jobsText}>
          {jobs.length === 0 ? (
            <p className="ma-intro">{data.jobsEmpty}</p>
          ) : (
            <GroupedList>
              {jobs.map((j) => <ListRow key={j.id} title={j.title} text={[j.team, j.location, j.workMode].filter(Boolean).join(" · ")} href={"/careers/" + j.slug} />)}
            </GroupedList>
          )}
          {data.buttonLabel && data.buttonHref && <div className="ma-actions"><Button href={data.buttonHref} block>{data.buttonLabel}</Button></div>}
        </Section>
      )}
    </>
  );
};
