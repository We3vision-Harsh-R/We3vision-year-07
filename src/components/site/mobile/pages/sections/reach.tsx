import type { MobileSection } from "../types";
import { Button, Card, Cloud, Section } from "../../app";
import { Rich } from "../../app/text";

// The rotating globe is 3D: here the places it marks are a list of names.
export const ReachSection: MobileSection<"reach"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <Card tone="tint">
      {data.text && <p><Rich text={data.text} /></p>}
      {data.places.length > 0 && <div className="ma-gap"><Cloud items={data.places.map((p) => p.label)} /></div>}
      {data.buttonLabel && <div className="ma-actions"><Button href={data.buttonHref || "#contact"} block>{data.buttonLabel}</Button></div>}
    </Card>
  </Section>
);
