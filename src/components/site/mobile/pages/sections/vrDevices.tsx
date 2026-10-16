import type { MobileSection } from "../types";
import { Button, Card, Cloud, Section } from "../../app";
import { lines } from "../../app/text";

export const VrDevicesSection: MobileSection<"vrDevices"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="ma-stack ma-grid2">
      {data.items.map((d, i) => (
        <Card key={i}>
          <p className="ma-kicker">{[d.kind, d.realities].filter(Boolean).join(" · ")}</p>
          <h3>{d.name}</h3>
          {d.text && <p>{d.text}</p>}
          {lines(d.tags).length > 0 && <div className="ma-gap"><Cloud items={lines(d.tags)} /></div>}
        </Card>
      ))}
    </div>
    {lines(data.tools).length > 0 && (
      <div className="ma-gap">
        <Card>
          <p className="ma-kicker">{data.toolsLabel}</p>
          <div className="ma-gap"><Cloud items={lines(data.tools)} /></div>
        </Card>
      </div>
    )}
    {data.ctaLabel && <div className="ma-actions"><Button href="#contact" block>{data.ctaLabel}</Button></div>}
  </Section>
);
