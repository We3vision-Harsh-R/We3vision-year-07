import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { Climb, SeoIndustries, type Kind } from "./client";

// /seo, written for Google first: ONE h1 (the hero), one h2 per section, h3 for every item, all the words in the HTML (nothing is only on a click),
// the questions also as FAQPage structured data. The look: a search result page. The hero has a ladder of results, "Watch a website climb" is a real
// toy (switch on the services and the website goes up), the industries show their search result, the questions are an open list.
// Same CMS words as the laptop. Styles: (m)/m/seo/page.css ("mp-seo-").

const rv = (i: number, step = 60) => ({ "--rv-d": `${i * step}ms` }) as CSSProperties;

/** the top: the eyebrow, the h1, the text, two buttons, and a ladder of results where the first one is lit */
export const SeoHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-seo-hero">
      <p className="mp-seo-eye">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        {data.chip}
      </p>
      <H className="mp-seo-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-seo-t">{data.text}</p>}
      <div className="mp-seo-btns">
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
      <div className="mp-seo-ladder" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <p key={i} style={{ "--i": i } as CSSProperties}>
            <em>{i + 1}</em>
            <span>
              <u />
              <u />
            </span>
          </p>
        ))}
      </div>
    </section>
  );
};

/** the story as plain text, the key words stay in the main colour */
export const SeoStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-seo-story">
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  </section>
);

/** "Watch a website climb": the invitation to the toy that is in the services section */
export const SeoGuide: MobileSection<"guide"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
    <AppLink href="#services" className="mp-seo-try">
      <span>{lines(data.tips)[0] ?? data.chip}</span>
      <IcChevron />
    </AppLink>
  </Section>
);

/** the services: each one is a switch that adds to a small stage (all on one screen), every word of it stays on the page; "More from We3vision" is a quiet list of links */
const servicesFor = (kind: Kind, words: { you: string; now: string; bar: string }): MobileSection<"services"> => {
  const Services: MobileSection<"services"> = ({ data, id }) => {
    if (id === "related-services") {
      return (
        <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
          <ul className="mp-seo-links">
            {data.cards.map((c, i) => (
              <li key={i} className="ma-rvx" style={rv(i, 50)}>
                <AppLink href={c.href || "#contact"}>
                  <span>
                    <b>{oneLine(c.title)}</b>
                    <small>{c.description}</small>
                  </span>
                  <IcChevron />
                </AppLink>
              </li>
            ))}
          </ul>
        </Section>
      );
    }
    return (
      <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
        <Climb
          kind={kind}
          {...words}
          items={data.cards.map((c) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return {
              title: oneLine(c.title),
              text: c.description,
              more:
                c.fit || problems.length > 0 || outcomes.length > 0 || c.href ? (
                  <div className="mp-seo-more">
                    {c.fit && <p>{c.fit}</p>}
                    {problems.length > 0 && <Points items={problems} />}
                    {outcomes.length > 0 && <Points items={outcomes} />}
                    {c.href && (
                      <div className="ma-actions">
                        <Button href={c.href} variant="tinted" block>
                          {oneLine(c.title)}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null,
            };
          })}
        />
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
  return Services;
};
export const SeoServices = servicesFor("serp", { you: "Your website", now: "Position", bar: "Progress" });
export const MetaServices = servicesFor("ad", { you: "", now: "Campaign", bar: "Progress" });
export const PhysicalServices = servicesFor("shop", { you: "", now: "Brand", bar: "Progress" });

/** the process: plain numbered steps, every step an h3 */
export const SeoProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-seo-steps">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 55)}>
          <span className="mp-seo-n" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3>{oneLine(x.title)}</h3>
          <p>{x.text}</p>
          {lines(x.points).length > 0 && <p className="mp-seo-pts">{lines(x.points).join("  ·  ")}</p>}
        </li>
      ))}
    </ol>
  </Section>
);

/** the tools as one line of text */
export const SeoTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <p className="mp-seo-stack">
      {lines(data.items).map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </p>
  </Section>
);

/** the industries: pick one and its search result appears */
export const SeoIndustriesSection: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <SeoIndustries items={data.items.map((x) => ({ name: x.name, description: x.description }))} />
  </Section>
);
export const PlainIndustriesSection: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <SeoIndustries plain items={data.items.map((x) => ({ name: x.name, description: x.description }))} />
  </Section>
);

/** the advantages: a tick, a short title (h3) and one line, open on the page */
export const SeoAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-seo-why">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 55)}>
          <i aria-hidden="true" />
          <div>
            <h3>{x.title}</h3>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** FAQ: an open list for people, and a FAQPage for Google (the answers are also plain text in the page) */
export const SeoFaq: MobileSection<"faq"> = ({ data, id }) => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map((x) => ({ "@type": "Question", name: oneLine(x.question), acceptedAnswer: { "@type": "Answer", text: x.answer } })),
  };
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <ul className="mp-seo-qa" data-exclusive>
        {data.items.map((x, i) => (
          <li key={i}>
            <details>
              <summary>
                <h3>{x.question}</h3>
                <i aria-hidden="true" />
              </summary>
              <p>{x.answer}</p>
            </details>
          </li>
        ))}
      </ul>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </Section>
  );
};
