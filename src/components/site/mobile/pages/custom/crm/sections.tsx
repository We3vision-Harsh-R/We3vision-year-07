import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { CrmPicker, CrmPipeline } from "./client";

// /crm in iOS 27: open and quiet. Regular type (500 only for row titles / open question, 600 for headings), hairline lists instead of boxes,
// one glass stage (the pipeline) and one picker (the CRM kinds). Same CMS words as the laptop. Styles: (m)/m/crm/page.css ("mp-crm-").

const rv = (i: number) => ({ "--rv-d": `${i * 60}ms` }) as CSSProperties;

/** the top: chip, large title, text, two buttons side by side, and a quiet pipeline of shapes under it */
export const CrmHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref, v: "fill" as const },
    { label: data.secondaryLabel, href: data.secondaryHref, v: "glass" as const },
  ].filter((a) => a.label && a.href);
  return (
    <section className="mp-crm-hero">
      {data.chip && <p className="mp-crm-chip">{data.chip}</p>}
      <H className="mp-crm-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-crm-t">{data.text}</p>}
      {acts.length > 0 && (
        <div className="mp-crm-btns">
          {acts.map((a) => (
            <Button key={a.href} href={a.href as string} variant={a.v}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
      <div className="mp-crm-flow" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            <i />
            <u />
            <u />
          </span>
        ))}
      </div>
    </section>
  );
};

/** the story as plain paragraphs, no boxes */
export const CrmStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec mp-crm-story">
    {paragraphs(data.body).map((p, i) => (
      <p key={i} className="ma-rvx" style={rv(i)}>
        <Rich text={p} />
      </p>
    ))}
  </section>
);

/** "What we build" = the CRM picker; "More from We3vision" = an open list with chevrons */
export const CrmServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-crm-more">
          {data.cards.map((c, i) => (
            <li key={i}>
              <AppLink href={c.href || "#contact"}>
                <span>
                  <b>{oneLine(c.title)}</b>
                  {c.description && <small>{c.description}</small>}
                </span>
                <IcChevron />
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <CrmPicker
          label={oneLine(data.heading) || "CRM"}
          items={data.cards.map((c) => ({
            title: oneLine(c.title),
            description: c.description ?? "",
            fit: c.fit ?? "",
            problems: lines(c.problems),
            outcomes: lines(c.outcomes),
            href: c.href ?? "",
          }))}
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

/** the steps as a pipeline you tap through (one glass stage) */
export const CrmProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <CrmPipeline label={oneLine(data.heading) || "Process"} steps={data.items.map((x) => ({ title: oneLine(x.title), text: x.text ?? "", points: lines(x.points) }))} />
  </Section>
);

/** the tools as quiet capsules (tertiary fill, regular weight) */
export const CrmTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-crm-caps">
      {lines(data.items).map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  </Section>
);

/** the kinds of CRM as an open list: a small tinted dot, the name, the text */
export const CrmIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-crm-rows">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={{ ...rv(i), "--o": i * 40 } as CSSProperties}>
          <span className="mp-crm-dot" aria-hidden="true" />
          <div>
            <b>{x.name}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the advantages as an open list of ticked items */
export const CrmAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-crm-rows is-done">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i)}>
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

/** the FAQ as an open list: + turns into −, one open at a time */
export const CrmFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-crm-qa" data-exclusive>
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
