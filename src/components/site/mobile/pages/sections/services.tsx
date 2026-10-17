import type { MobileSection } from "../types";
import { Button, Card, Carousel, GroupedList, ListRow, Points, Section } from "../../app";
import { IcChevron } from "../../app/icons";
import { Lines, lines, oneLine } from "../../app/text";

export const ServicesSection: MobileSection<"services"> = ({ data, id }) => {
  // a list of links with a short line each ("More from We3vision") is a list of rows; real service cards swipe
  const linksOnly = data.cards.length > 0 && data.cards.every((c) => c.href && !c.fit && !lines(c.problems).length && !lines(c.outcomes).length);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {linksOnly ? (
        <GroupedList>
          {data.cards.map((c, i) => (
            <ListRow key={i} title={oneLine(c.title)} text={c.description} href={c.href} />
          ))}
        </GroupedList>
      ) : (
        <Carousel label={oneLine(data.heading)}>
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            const more = c.fit || problems.length > 0 || outcomes.length > 0;
            return (
              <Card key={i} className="ma-fill">
                <h3><Lines text={c.title} /></h3>
                {c.description && <p>{c.description}</p>}
                {more && (
                  <details className="ma-fold">
                    <summary>Details<IcChevron /></summary>
                    <div>
                      {c.fit && (<><p className="ma-sublabel">Right for you when</p><p>{c.fit}</p></>)}
                      {problems.length > 0 && (<><p className="ma-sublabel">Problems it solves</p><Points items={problems} /></>)}
                      {outcomes.length > 0 && (<><p className="ma-sublabel">What you get</p><Points items={outcomes} /></>)}
                    </div>
                  </details>
                )}
                {c.href && <div className="ma-actions"><Button href={c.href} variant="tinted" block>Learn more</Button></div>}
              </Card>
            );
          })}
        </Carousel>
      )}
      {data.buttonLabel && data.buttonHref && <div className="ma-actions"><Button href={data.buttonHref} block>{data.buttonLabel}</Button></div>}
    </Section>
  );
};
