import type { MobileSection } from "../types";
import { Card, Points, Section } from "../../app";
import { StepList } from "../blocks";
import { Rich, lines } from "../../app/text";

export const AboutChaptersSection: MobileSection<"aboutChapters"> = ({ data, id }) => (
  <>
    <StepList id={id} chip={data.chip} heading={data.heading} steps={data.chapters.map((c) => ({ title: c.title, text: c.text }))} />
    <Section chip={data.meet.chip} title={data.meet.heading}>
      <Card tone="tint">
        {data.meet.text && <p><Rich text={data.meet.text} /></p>}
        <Points items={lines(data.meet.tips)} />
      </Card>
    </Section>
  </>
);
