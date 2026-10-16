import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";

// /mobile as an App Store: the hero is an app's product page (icon, name, a pill button), the story its description, the services Today cards,
// the technologies a row of app icons, the industries Categories, the related services "You might also like". Same CMS words as the laptop.
// Styles: (m)/m/mobile/page.css.

/** a hue shift per item, so the icons and cards are not all one colour (theme-relative) */
const hue = (i: number) => ({ "--o": i * 38 }) as CSSProperties;

/** the app icon of the product page: a phone glyph on a gradient tile */
function Icon() {
  return (
    <span className="mp-ap-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
        <path d="M10.5 18.5h3" />
      </svg>
    </span>
  );
}

/** the top: an App Store product page; the first button is the "GET" pill */
export const AppHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-ap-page">
      <div className="mp-ap-head">
        <Icon />
        <div className="mp-ap-name">
          <H className="mp-ap-h">
            <Lines text={data.heading} />
          </H>
          <p className="mp-ap-sub">{data.chip}</p>
        </div>
      </div>
      <div className="mp-ap-btns">
        {data.primaryLabel && data.primaryHref && (
          <AppLink href={data.primaryHref} className="mp-ap-get">
            {data.primaryLabel}
          </AppLink>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <AppLink href={data.secondaryHref} className="mp-ap-more">
            {data.secondaryLabel}
          </AppLink>
        )}
      </div>
      {data.text && <p className="mp-ap-desc">{data.text}</p>}
    </section>
  );
};

/** the story as the description of the app page */
export const AppStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-ap-about">
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  </section>
);

/** "Apps for every platform" = Today cards; "More from We3vision" = You Might Also Like */
export const AppServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-ap-also">
          {data.cards.map((c, i) => (
            <li key={i} style={hue(i)}>
              <AppLink href={c.href || "#contact"} className="mp-ap-also-a">
                <span className="mp-ap-ic" aria-hidden="true">
                  {oneLine(c.title).charAt(0)}
                </span>
                <span className="mp-ap-ab">
                  <b>
                    <Lines text={c.title} />
                  </b>
                  <span>{c.description}</span>
                </span>
                <IcChevron className="mp-ap-chev" />
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mp-ap-today ma-grid2">
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return (
              <article key={i} className="mp-ap-tc" style={hue(i)}>
                <div className="mp-ap-tc-top">
                  <h3>
                    <Lines text={c.title} />
                  </h3>
                  <p>{c.description}</p>
                </div>
                {(c.fit || problems.length > 0 || outcomes.length > 0 || c.href) && (
                  <div className="mp-ap-tc-body">
                    {c.fit && (
                      <>
                        <p className="mp-ap-lab">Right for you when</p>
                        <p>{c.fit}</p>
                      </>
                    )}
                    {problems.length > 0 && (
                      <>
                        <p className="mp-ap-lab">Problems it solves</p>
                        <Points items={problems} />
                      </>
                    )}
                    {outcomes.length > 0 && (
                      <>
                        <p className="mp-ap-lab">What you get</p>
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

/** the build process as the version history: a big number, the title and the notes */
export const AppProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-ap-hist">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-ap-ver">{i + 1}</span>
          <div>
            <h3>{oneLine(x.title)}</h3>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && <Points items={lines(x.points)} />}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** the technologies as a row of app icons with the name under each */
export const AppTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ap-icons">
      {lines(data.items).map((t, i) => (
        <li key={i} style={hue(i)}>
          <span className="mp-ap-ic" aria-hidden="true">
            {t.charAt(0)}
          </span>
          <span className="mp-ap-il">{t}</span>
        </li>
      ))}
    </ul>
  </Section>
);

/** the industries as App Store Categories */
export const AppIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ap-cats">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <span className="mp-ap-ic" aria-hidden="true">
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

/** the advantages as editors' choice cards in a sideways row */
export const AppAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ap-picks">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <span className="mp-ap-star" aria-hidden="true" />
          <b>{x.title}</b>
          <p>{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ as the information rows of an app page */
export const AppFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-ap-info">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <span>{x.question}</span>
            <IcChevron className="mp-ap-chev" />
          </summary>
          <p>{x.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);
