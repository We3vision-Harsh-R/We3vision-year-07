import type { MobileSection } from "../types";
import { Card, Cloud, Section, Stepper } from "../../app";
import { lines } from "../../app/text";

// The animated run of an AI agent, as a still story: trigger, steps, tools and results.
export const FlowSection: MobileSection<"flow"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <Card tone="tint">
      <p className="ma-kicker">{data.triggerLabel}</p>
      <h3>{data.triggerText}</h3>
      {data.coreLabel && <p className="ma-sublabel">{data.coreLabel}</p>}
      <div className="ma-gap"><Stepper steps={lines(data.steps).map((s) => ({ title: s }))} /></div>
      {data.runNote && <p className="ma-cap">{data.runNote}</p>}
    </Card>
    <div className="ma-stack ma-gap ma-grid2">
      {data.sources.length > 0 && (
        <Card>
          <p className="ma-kicker">{data.sourcesLabel}{data.sourcesNote ? " · " + data.sourcesNote : ""}</p>
          <div className="ma-gap"><Cloud items={data.sources.map((s) => s.label)} /></div>
        </Card>
      )}
      {data.actions.length > 0 && (
        <Card>
          <p className="ma-kicker">{data.actionsLabel}{data.actionsNote ? " · " + data.actionsNote : ""}</p>
          <div className="ma-gap"><Cloud items={data.actions.map((s) => s.label)} /></div>
        </Card>
      )}
    </div>
  </Section>
);
