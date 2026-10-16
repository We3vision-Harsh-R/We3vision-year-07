import type { MobileSection } from "../types";
import { Card, Section } from "../../app";
import { Rich, paragraphs } from "../../app/text";

export const TeamManifestoSection: MobileSection<"teamManifesto"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <Card><div className="ma-prose">{paragraphs(data.body).map((p, i) => <p key={i}><Rich text={p} /></p>)}</div></Card>
    {data.quote && (
      <div className="ma-gap">
        <Card tone="tint">
          <p className="ma-quote">{data.quote}</p>
          {data.quoteBy && <p className="ma-cap">{data.quoteBy}</p>}
        </Card>
      </div>
    )}
  </Section>
);
