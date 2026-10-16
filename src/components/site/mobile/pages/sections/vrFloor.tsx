import type { MobileSection } from "../types";
import { Button, Card, Cloud, Points, Section } from "../../app";
import { Lines, lines } from "../../app/text";

// The walk through the virtual office is 3D on the laptop: here the tip, the cabins and the government projects as cards.
export const VrFloorSection: MobileSection<"vrFloor"> = ({ data, id }) => (
  <>
    <Section id={id} title={data.heading} intro={data.hint}>
      {(data.tipTitle || data.tipText) && (
        <Card tone="tint">
          {data.tipTitle && <h3>{data.tipTitle}</h3>}
          {data.tipText && <p>{data.tipText}</p>}
        </Card>
      )}
    </Section>
    {data.cabins.length > 0 && (
      <Section title={data.industriesTitle}>
        <div className="ma-stack ma-grid2">
          {data.cabins.map((c, i) => (
            <Card key={i}>
              <p className="ma-kicker">{c.code}</p>
              <h3><Lines text={c.name} /></h3>
              {c.text && <p>{c.text}</p>}
              {lines(c.industries).length > 0 && <div className="ma-gap"><Cloud items={lines(c.industries)} /></div>}
            </Card>
          ))}
        </div>
        {data.ctaLabel && <div className="ma-actions"><Button href="#contact" block>{data.ctaLabel}</Button></div>}
      </Section>
    )}
    {data.projects.length > 0 && (
      <Section title={data.govTitle}>
        <div className="ma-stack ma-grid2">
          {data.projects.map((p, i) => (
            <Card key={i}>
              <p className="ma-kicker">{[p.org, p.status, p.period].filter(Boolean).join(" · ")}</p>
              <h3>{p.title}</h3>
              {p.orgFull && <p>{p.orgFull}</p>}
              {p.by && <p>{p.by}</p>}
              {p.text && <p>{p.text}</p>}
              {lines(p.steps).length > 0 && <Points items={lines(p.steps)} />}
              {lines(p.tags).length > 0 && <div className="ma-gap"><Cloud items={lines(p.tags)} /></div>}
              {lines(p.team).length > 0 && <p className="ma-cap">{lines(p.team).join(", ")}</p>}
            </Card>
          ))}
        </div>
      </Section>
    )}
  </>
);
