import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { IndustryStage, ServicePicker } from "./client";

// /software-development-services, quiet and open: no boxes, hairlines between things, regular type (medium only where it matters), a lot of space.
// The hero is a file name and a large title; the services are a picker you can use; the process is a thread that fills as you read; the questions
// are an open list. Same CMS words as the laptop. Styles: (m)/m/software-development-services/page.css ("mp-sw-").

const rv = (i: number, step = 60) => ({ "--rv-d": `${i * step}ms` }) as CSSProperties;

/** the top: the file name of a project, the title, the text and the two buttons side by side */
export const SwHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-sw-hero">
      <p className="mp-sw-file">
        <span aria-hidden="true">{"{ }"}</span>
        {data.chip}
        <i aria-hidden="true" />
      </p>
      <H className="mp-sw-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-sw-t">{data.text}</p>}
      <div className="mp-sw-btns">
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
export const SwStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-sw-story">
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  </section>
);

/** "What we build": pick a service, read it; "More from We3vision": a quiet list of links */
export const SwServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-sw-recent">
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
        <ServicePicker
          label={oneLine(data.heading)}
          tabs={data.cards.map((c) => oneLine(c.title))}
          panels={data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return (
              <div key={i}>
                <h3>{oneLine(c.title)}</h3>
                <p className="mp-sw-lead">{c.description}</p>
                {c.fit && (
                  <>
                    <p className="mp-sw-lab">Right for you when</p>
                    <p>{c.fit}</p>
                  </>
                )}
                {problems.length > 0 && (
                  <>
                    <p className="mp-sw-lab">Problems it solves</p>
                    <Points items={problems} />
                  </>
                )}
                {outcomes.length > 0 && (
                  <>
                    <p className="mp-sw-lab">What you get</p>
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
            );
          })}
        />
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

/** the life cycle: six steps, a small number, a title, a line. Nothing else. */
export const SwProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-sw-steps">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 60)}>
          <span className="mp-sw-n" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3>{oneLine(x.title)}</h3>
          <p>{x.text}</p>
          {lines(x.points).length > 0 && <p className="mp-sw-pts">{lines(x.points).join("  ·  ")}</p>}
        </li>
      ))}
    </ol>
  </Section>
);

/** the technologies as one line of text */
export const SwTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <p className="mp-sw-stack">
      {lines(data.items).map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </p>
  </Section>
);

/** the industries as a stage: pick one and a small app of that kind builds itself, with the text and a button under it */
export const SwIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <IndustryStage items={data.items.map((x) => ({ name: x.name, description: x.description }))} />
  </Section>
);

/** the advantages: a short title and one line, open on the page */
export const SwAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-sw-insp">
      {data.items.map((x, i) => (
        <section key={i} className="ma-rvx" style={rv(i, 50)}>
          <h3>{x.title}</h3>
          <p>{x.description}</p>
        </section>
      ))}
    </div>
  </Section>
);

/** FAQ: an open list; the question is a regular line, the answer opens under it */
export const SwFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-sw-qa" data-exclusive>
      {data.items.map((x, i) => (
        <li key={i}>
          <details>
            <summary>
              <span>{x.question}</span>
              <i aria-hidden="true" />
            </summary>
            <p>{x.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  </Section>
);
