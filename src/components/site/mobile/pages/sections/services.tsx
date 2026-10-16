import type { MobileSection } from "../types";
import { Button, Card, Points, Section } from "../../app";
import { Lines, lines } from "../../app/text";

export const ServicesSection: MobileSection<"services"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="ma-stack ma-grid2">
      {data.cards.map((c, i) => {
        const problems = lines(c.problems);
        const outcomes = lines(c.outcomes);
        return (
          <Card key={i}>
            <h3><Lines text={c.title} /></h3>
            {c.description && <p>{c.description}</p>}
            {c.fit && (<><p className="ma-sublabel">Right for you when</p><p>{c.fit}</p></>)}
            {problems.length > 0 && (<><p className="ma-sublabel">Problems it solves</p><Points items={problems} /></>)}
            {outcomes.length > 0 && (<><p className="ma-sublabel">What you get</p><Points items={outcomes} /></>)}
            {c.href && <div className="ma-actions"><Button href={c.href} variant="tinted" block>Learn more</Button></div>}
          </Card>
        );
      })}
    </div>
    {data.buttonLabel && data.buttonHref && <div className="ma-actions"><Button href={data.buttonHref} block>{data.buttonLabel}</Button></div>}
  </Section>
);
