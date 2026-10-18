import type { CSSProperties } from "react";
import type { MobileSection } from "../types";
import { Section } from "../../app";
import { lines } from "../../app/text";

// The animated run of an AI agent, as a still, open story (no cards): the trigger, a thread of numbered steps,
// then what it reads from and what it does, as quiet capsules.
export const FlowSection: MobileSection<"flow"> = ({ data, id }) => {
  const steps = lines(data.steps);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {data.triggerLabel && <p className="ma-ia-lab">{data.triggerLabel}</p>}
      {data.triggerText && <h3 className="ma-ia-ph">{data.triggerText}</h3>}
      {data.coreLabel && <p className="ma-ia-txt">{data.coreLabel}</p>}
      {steps.length > 0 && (
        <ol className="ma-ia-thread">
          {steps.map((s, i) => (
            <li key={i} className="ma-rvx" style={{ "--rv-d": `${Math.min(i, 5) * 70}ms` } as CSSProperties}>{s}</li>
          ))}
        </ol>
      )}
      {data.runNote && <p className="ma-ia-foot">{data.runNote}</p>}
      {data.sources.length > 0 && (
        <>
          <p className="ma-ia-lab">{data.sourcesLabel}{data.sourcesNote ? " · " + data.sourcesNote : ""}</p>
          <ul className="ma-ia-words">{data.sources.map((s, i) => <li key={i}>{s.label}</li>)}</ul>
        </>
      )}
      {data.actions.length > 0 && (
        <>
          <p className="ma-ia-lab">{data.actionsLabel}{data.actionsNote ? " · " + data.actionsNote : ""}</p>
          <ul className="ma-ia-words">{data.actions.map((s, i) => <li key={i}>{s.label}</li>)}</ul>
        </>
      )}
    </Section>
  );
};
