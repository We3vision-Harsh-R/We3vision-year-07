import type { MobileSection } from "../../types";
import { Accordion, AppLink, Button, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { SiteBuilder } from "./builder";

// /webdev as a Safari-like app: the hero is a browser window, the story a Reader page, the services open tabs, the tools a Favourites grid,
// the related services Top Hits. Same CMS words as the laptop. Styles: (m)/m/webdev/page.css.

/** the top: a browser window; the chip is the tab, the two buttons of the laptop sit in the toolbar */
export const WebHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-wd-win">
      <div className="mp-wd-bar">
        <span className="mp-wd-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="mp-wd-tab">
          <span className="mp-wd-lock" aria-hidden="true" />
          {data.chip}
        </span>
      </div>
      <div className="mp-wd-view">
        <H className="mp-wd-h">
          <Lines text={data.heading} />
        </H>
        {data.text && <p className="mp-wd-t">{data.text}</p>}
      </div>
      <div className="mp-wd-tool">
        {data.primaryLabel && data.primaryHref && (
          <AppLink href={data.primaryHref} className="mp-wd-go">
            {data.primaryLabel}
          </AppLink>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <AppLink href={data.secondaryHref} className="mp-wd-alt">
            {data.secondaryLabel}
          </AppLink>
        )}
      </div>
    </section>
  );
};

/** the story in Reader view: an "Aa" bar and an article */
export const WebStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <article className="mp-wd-reader">
      <div className="mp-wd-rbar" aria-hidden="true">
        <span>Aa</span>
        <i />
      </div>
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </article>
  </section>
);

/** "Type a name, watch it get built": a field and a small page that takes the name; the tips as notes */
export const WebGuide: MobileSection<"guide"> = ({ data, id }) => {
  const tips = lines(data.tips);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
      <SiteBuilder label={tips[0] ?? oneLine(data.heading)} />
      {tips.length > 0 && (
        <ul className="mp-wd-notes">
          {tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
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

/** "More from We3vision" = Top Hits: link cards; "What we build" = open tabs, each opens to its details */
export const WebServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-wd-hits">
          {data.cards.map((c, i) => (
            <li key={i}>
              <AppLink href={c.href || "#contact"} className="mp-wd-hit">
                <span className="mp-wd-glob" aria-hidden="true" />
                <span className="mp-wd-hb">
                  <b>
                    <Lines text={c.title} />
                  </b>
                  <span>{c.description}</span>
                </span>
                <IcChevron className="mp-wd-chev" />
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mp-wd-tabs">
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            const more = c.fit || problems.length > 0 || outcomes.length > 0;
            return (
              <details key={i} className="mp-wd-card" open={i === 0}>
                <summary>
                  <span className="mp-wd-cbar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="mp-wd-ct">
                    <b>
                      <Lines text={c.title} />
                    </b>
                    <span>{c.description}</span>
                  </span>
                  {more && <IcChevron className="mp-wd-chev" />}
                </summary>
                {more && (
                  <div className="mp-wd-cb">
                    {c.fit && (
                      <>
                        <p className="mp-wd-lab">Right for you when</p>
                        <p>{c.fit}</p>
                      </>
                    )}
                    {problems.length > 0 && (
                      <>
                        <p className="mp-wd-lab">Problems it solves</p>
                        <Points items={problems} />
                      </>
                    )}
                    {outcomes.length > 0 && (
                      <>
                        <p className="mp-wd-lab">What you get</p>
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
                )}
              </details>
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

/** the build process as a reading list: one row per stage, open to read the points */
export const WebProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <Accordion
      openFirst
      items={data.items.map((x, i) => ({
        title: (
          <span className="mp-wd-rl">
            <span className="mp-wd-rn">{i + 1}</span>
            {oneLine(x.title)}
          </span>
        ),
        body: (
          <>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && <Points items={lines(x.points)} />}
          </>
        ),
      }))}
    />
  </Section>
);

/** the technologies as the Favourites grid of a start page */
export const WebTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-wd-favs">
      {lines(data.items).map((t, i) => (
        <li key={i}>
          <span className="mp-wd-fi" aria-hidden="true">
            {t.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}
          </span>
          <span className="mp-wd-fl">{t}</span>
        </li>
      ))}
    </ul>
  </Section>
);

/** industries as bookmark folders */
export const WebIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-wd-marks">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-wd-folder" aria-hidden="true" />
          <div>
            <b>{x.name}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the advantages as a privacy report: a shield row per point */
export const WebAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-wd-shield">
      {data.items.map((x, i) => (
        <li key={i}>
          <span aria-hidden="true" />
          <div>
            <b>{x.title}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ as page-find results: the question is the found text, the answer opens under it */
export const WebFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-wd-faq">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <span>{x.question}</span>
            <IcChevron className="mp-wd-chev" />
          </summary>
          <p>{x.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);
