import type { MobileSection } from "../types";
import { AppLink, IcChevron, Points, Section } from "../../app";
import { lines, oneLine } from "../../app/text";
import { IaPicker } from "./ios27-a-client";

export const ServicesSection: MobileSection<"services"> = ({ data, id }) => {
  // a list of links with a short line each ("More from We3vision") is an open list of rows; real services are a segmented picker:
  // pick a name and its words open below with a soft crossfade (every panel stays in the page)
  const linksOnly = data.cards.length > 0 && data.cards.every((c) => c.href && !c.fit && !lines(c.problems).length && !lines(c.outcomes).length);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {linksOnly ? (
        <ul className="ma-ia-links">
          {data.cards.map((c, i) => (
            <li key={i}>
              <AppLink href={c.href} className="ma-ia-link">
                <span>
                  <b>{oneLine(c.title)}</b>
                  {c.description && <small>{c.description}</small>}
                </span>
                <IcChevron />
              </AppLink>
            </li>
          ))}
        </ul>
      ) : data.cards.length > 0 ? (
        <IaPicker
          label={oneLine(data.heading) || "Services"}
          tabs={data.cards.map((c) => oneLine(c.title))}
          panels={data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return (
              <div key={i}>
                <h3 className="ma-ia-ph">{oneLine(c.title)}</h3>
                {c.description && <p className="ma-ia-body">{c.description}</p>}
                {c.fit && (<><p className="ma-ia-lab">Right for you when</p><p className="ma-ia-txt">{c.fit}</p></>)}
                {problems.length > 0 && (<><p className="ma-ia-lab">Problems it solves</p><Points items={problems} /></>)}
                {outcomes.length > 0 && (<><p className="ma-ia-lab">What you get</p><Points items={outcomes} /></>)}
                {c.href && <AppLink href={c.href} className="ma-ia-more">Learn more<IcChevron /></AppLink>}
              </div>
            );
          })}
        />
      ) : null}
      {data.buttonLabel && data.buttonHref && (
        <div className="ma-ia-btns">
          <AppLink href={data.buttonHref} className="ma-btn ma-ia-glass">{data.buttonLabel}</AppLink>
        </div>
      )}
    </Section>
  );
};
