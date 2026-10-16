import type { MobileSection } from "../types";
import { Card, Points, Section } from "../../app";
import { HeroBlock, StepList } from "../blocks";
import { Rich, lines } from "../../app/text";

// The 3D island story is a scroll scene on the laptop: here its hero, its chapters and the "meet" card, in the same words.
export const AboutWorldSection: MobileSection<"aboutWorld"> = ({ data, id, index }) => (
  <>
    <HeroBlock index={index} chip={data.hero.chip} heading={data.hero.heading} text={data.hero.text} actions={[{ label: data.hero.secondaryLabel, href: data.hero.secondaryHref }]} />
    <StepList id={id} steps={data.chapters.map((c) => ({ title: c.title, text: c.text }))} />
    <Section chip={data.meet.chip} title={data.meet.heading}>
      <Card tone="tint">
        {data.meet.text && <p><Rich text={data.meet.text} /></p>}
        <Points items={lines(data.meet.tips)} />
      </Card>
    </Section>
  </>
);
