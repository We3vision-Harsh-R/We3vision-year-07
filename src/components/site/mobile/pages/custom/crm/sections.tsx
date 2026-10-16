import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";

// /crm as Reminders + Numbers: the hero is a list with check circles (the two buttons are its reminders), every service a list where the
// problems are open circles and the results are ticked ones, the process rings fill step by step, the tools are #tags.
// Same CMS words as the laptop. Styles: (m)/m/crm/page.css.

const hue = (i: number) => ({ "--o": i * 52 }) as CSSProperties;

/** the top: a list with a coloured title; the buttons are the first reminders */
export const CrmHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-crm-list">
      <p className="mp-crm-tag">{data.chip}</p>
      <H className="mp-crm-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-crm-t">{data.text}</p>}
      <ul className="mp-crm-todo">
        {data.primaryLabel && data.primaryHref && (
          <li>
            <AppLink href={data.primaryHref} className="mp-crm-item is-main">
              <span className="mp-crm-ring" aria-hidden="true" />
              <span>{data.primaryLabel}</span>
              <IcChevron className="mp-crm-chev" />
            </AppLink>
          </li>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <li>
            <AppLink href={data.secondaryHref} className="mp-crm-item">
              <span className="mp-crm-ring" aria-hidden="true" />
              <span>{data.secondaryLabel}</span>
              <IcChevron className="mp-crm-chev" />
            </AppLink>
          </li>
        )}
      </ul>
    </section>
  );
};

/** the story as two notes, each with a coloured edge */
export const CrmStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-crm-notes">
      {paragraphs(data.body).map((p, i) => (
        <article key={i} style={hue(i)}>
          <p>
            <Rich text={p} />
          </p>
        </article>
      ))}
    </div>
  </section>
);

/** "What we build" = one list per CRM (problems open, results ticked); "More from We3vision" = list tiles that link */
export const CrmServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-crm-tiles">
          {data.cards.map((c, i) => (
            <li key={i} style={hue(i + 2)}>
              <AppLink href={c.href || "#contact"} className="mp-crm-tile">
                <span className="mp-crm-dot" aria-hidden="true" />
                <b>
                  <Lines text={c.title} />
                </b>
                <span>{c.description}</span>
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mp-crm-lists ma-grid2">
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return (
              <article key={i} className="mp-crm-card" style={hue(i)}>
                <header>
                  <span className="mp-crm-dot" aria-hidden="true" />
                  <h3>
                    <Lines text={c.title} />
                  </h3>
                </header>
                {c.description && <p className="mp-crm-d">{c.description}</p>}
                {c.fit && (
                  <p className="mp-crm-fit">
                    <b>Right for you when</b>
                    {c.fit}
                  </p>
                )}
                {problems.length > 0 && (
                  <>
                    <p className="mp-crm-lab">Problems it solves</p>
                    <ul className="mp-crm-chk">
                      {problems.map((p, n) => (
                        <li key={n}>
                          <span className="mp-crm-ring" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {outcomes.length > 0 && (
                  <>
                    <p className="mp-crm-lab">What you get</p>
                    <ul className="mp-crm-chk is-done">
                      {outcomes.map((p, n) => (
                        <li key={n}>
                          <span className="mp-crm-ring is-on" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {c.href && (
                  <div className="ma-actions">
                    <Button href={c.href} variant="tinted" block>
                      Learn more
                    </Button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
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

/** the steps as progress: a ring fills one step further on every row */
export const CrmProcess: MobileSection<"process"> = ({ data, id }) => {
  const n = data.items.length;
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <ol className="mp-crm-prog">
        {data.items.map((x, i) => (
          <li key={i}>
            <span className="mp-crm-pie" style={{ "--p": ((i + 1) / n) * 100 } as CSSProperties} aria-label={`${i + 1} / ${n}`}>
              <b>{i + 1}</b>
            </span>
            <div>
              <h3>{oneLine(x.title)}</h3>
              <p>{x.text}</p>
              {lines(x.points).length > 0 && (
                <ul className="mp-crm-sub">
                  {lines(x.points).map((p, k) => (
                    <li key={k}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
};

/** the tools as #tags */
export const CrmTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-crm-hash">
      {lines(data.items).map((t, i) => (
        <li key={i} style={hue(i)}>
          {t}
        </li>
      ))}
    </ul>
  </Section>
);

/** the kinds of CRM as "My Lists": a coloured circle, the name, the text */
export const CrmIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-crm-mylists">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <span className="mp-crm-ic" aria-hidden="true">
            {oneLine(x.name).charAt(0)}
          </span>
          <div>
            <b>{x.name}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the advantages as completed items, each with a ticked ring */
export const CrmAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-crm-done">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-crm-ring is-on" aria-hidden="true" />
          <div>
            <b>{x.title}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ as contact-card fields: the question is the label, the answer the value */
export const CrmFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <dl className="mp-crm-card-faq">
      {data.items.map((x, i) => (
        <div key={i}>
          <dt>{x.question}</dt>
          <dd>{x.answer}</dd>
        </div>
      ))}
    </dl>
  </Section>
);
