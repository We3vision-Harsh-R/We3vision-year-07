import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { Turntable } from "./client";

// /3d-modeling in iOS 27, a quiet Reality Composer: open space, hairlines, regular type (500 for row titles, 600 for headings).
// The one tool is the hero stage: a glass turntable with a cube you turn with a finger or the arrow keys (CSS 3D, no engine);
// small solids (cube, sphere, pyramid, ring) mark the services and industries; the process is a flow of numbered nodes. Same CMS words.
// Styles: (m)/m/3d-modeling/page.css ("mp-3d-").

const rv = (i: number, step = 60) => ({ "--rv-d": `${i * step}ms`, "--o": i * 33 }) as CSSProperties;

/** the top: a glass stage with a cube you can turn (drag or arrow keys), the chip, the title, the text, two buttons */
export const ArHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-3d-hero">
      <Turntable label={oneLine(data.heading)} />
      <p className="mp-3d-chipline">{data.chip}</p>
      <H className="mp-3d-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-3d-t">{data.text}</p>}
      <div className="mp-3d-btns">
        {data.primaryLabel && data.primaryHref && (
          <AppLink href={data.primaryHref} className="ma-btn ma-btn-fill">
            {data.primaryLabel}
          </AppLink>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <AppLink href={data.secondaryHref} className="ma-btn">
            {data.secondaryLabel}
          </AppLink>
        )}
      </div>
    </section>
  );
};

/** the story: plain open text */
export const ArStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-3d-story">
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  </section>
);

/** The services = an open list: a small solid, the name, one line, open for the details; "More from We3vision" = quiet links */
export const ArServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-3d-links">
          {data.cards.map((c, i) => (
            <li key={i} className="ma-rvx" style={rv(i, 50)}>
              <AppLink href={c.href || "#contact"}>
                <span>
                  <b>
                    <Lines text={c.title} />
                  </b>
                  <small>{c.description}</small>
                </span>
                <IcChevron />
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mp-3d-list" data-exclusive>
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return (
              <li key={i} className="ma-rvx" style={rv(i, 50)}>
                <details>
                  <summary>
                    <span className="mp-3d-solid" aria-hidden="true" />
                    <span className="mp-3d-row">
                      <b>
                        <Lines text={c.title} />
                      </b>
                      <small>{c.description}</small>
                    </span>
                    <i className="mp-3d-pm" aria-hidden="true" />
                  </summary>
                  <div className="mp-3d-more">
                    {c.fit && (
                      <>
                        <p className="mp-3d-lab">Right for you when</p>
                        <p>{c.fit}</p>
                      </>
                    )}
                    {problems.length > 0 && (
                      <>
                        <p className="mp-3d-lab">Problems it solves</p>
                        <Points items={problems} />
                      </>
                    )}
                    {outcomes.length > 0 && (
                      <>
                        <p className="mp-3d-lab">What you get</p>
                        <Points items={outcomes} />
                      </>
                    )}
                    {c.href && (
                      <div className="ma-actions">
                        <Button href={c.href} variant="tinted" block>
                          Learn more
                        </Button>
                      </div>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
      {data.buttonLabel && data.buttonHref && (
        <div className="ma-actions">
          <Button href={data.buttonHref} block>
            {data.buttonLabel}
          </Button>
        </div>
      )}
    </Section>
  );
};

/** the process as a flow: a small node and a connector line between steps */
export const ArProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-3d-flow">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i)}>
          <span className="mp-3d-node" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3>{oneLine(x.title)}</h3>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && <p className="mp-3d-pts">{lines(x.points).join("  ·  ")}</p>}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** the tool stack as one line of text */
export const ArTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <p className="mp-3d-stack">
      {lines(data.items).map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </p>
  </Section>
);

/** the industries as an open list, each with a small solid */
export const ArIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-3d-ind">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 50)}>
          <span className="mp-3d-solid" aria-hidden="true" />
          <div>
            <b>{x.name}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the advantages: a short title and one line, open on the page */
export const ArAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-3d-why">
      {data.items.map((x, i) => (
        <section key={i} className="ma-rvx" style={rv(i, 50)}>
          <h3>{x.title}</h3>
          <p>{x.description}</p>
        </section>
      ))}
    </div>
  </Section>
);

/** FAQ: an open list; a regular question, a + that turns into −, the answer under it */
export const ArFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-3d-qa" data-exclusive>
      {data.items.map((x, i) => (
        <li key={i}>
          <details>
            <summary>
              <span>{x.question}</span>
              <i className="mp-3d-pm" aria-hidden="true" />
            </summary>
            <p>{x.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  </Section>
);
