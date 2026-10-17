import type { ReactNode } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Clamp, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { SiteBuilder } from "./builder";

// /webdev as one app: every section is the same kind of screen. A section header (label, title, intro) and then ONE grouped panel of rows;
// a row is a tile + a title + a line of text, and it opens when there is more to read. Same CMS words as the laptop.
// The bottom tab bar (Overview / Services / Process / Tech / Apps) is added by renderMobilePage. Styles: (m)/m/webdev/page.css ("mp-wd-").

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
const IcBuilding = () => (<svg {...svg}><path d="M4 20V7.5L12 4l8 3.5V20M4 20h16M9 20v-5h6v5" /></svg>);
const IcCheck = () => (<svg {...svg}><path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.2-7 9-4.1-1.8-7-4.8-7-9V6zM8.8 12l2.3 2.3 4.2-4.6" /></svg>);
const IcAsk = () => (<svg {...svg}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5M12 16.7h.01" /></svg>);
const IcGlobe = () => (<svg {...svg}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" /></svg>);

const Tile = ({ children }: { children: ReactNode }) => (
  <span className="mp-wd-tile" aria-hidden="true">
    {children}
  </span>
);

/** a row of a panel: tile, title, one line of text, and (when `open` content is given) a chevron */
function Fold({ tile, title, text, open, children }: { tile: ReactNode; title: ReactNode; text?: string; open?: boolean; children?: ReactNode }) {
  const head = (
    <>
      <Tile>{tile}</Tile>
      <span className="mp-wd-body">
        <b>{title}</b>
        {text && <span>{text}</span>}
      </span>
    </>
  );
  if (!children) return <div className="mp-wd-row">{head}</div>;
  return (
    <details className="mp-wd-fold" open={open}>
      <summary className="mp-wd-row">
        {head}
        <IcChevron className="mp-wd-chev" />
      </summary>
      <div className="mp-wd-fb">{children}</div>
    </details>
  );
}

/** the top: the hero card of the app */
export const WebHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-wd-hero">
      {data.chip && <span className="ma-chip">{data.chip}</span>}
      <H className="mp-wd-h">
        <Lines text={data.heading} />
      </H>
      {data.text && (data.text.length > 210 ? <Clamp lines={4}><p className="mp-wd-t">{data.text}</p></Clamp> : <p className="mp-wd-t">{data.text}</p>)}
      <div className="ma-actions">
        {data.primaryLabel && data.primaryHref && (
          <Button href={data.primaryHref} block>
            {data.primaryLabel}
          </Button>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <Button href={data.secondaryHref} variant="tinted" block>
            {data.secondaryLabel}
          </Button>
        )}
      </div>
    </section>
  );
};

/** the story: the paragraphs in one panel */
export const WebStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <article className="mp-wd-panel mp-wd-story">
      <Clamp lines={6}>
        {paragraphs(data.body).map((p, i) => (
          <p key={i}>
            <Rich text={p} />
          </p>
        ))}
      </Clamp>
    </article>
  </section>
);

/** "Type a name, watch it get built": a field and a small page that takes the name; the tips as rows */
export const WebGuide: MobileSection<"guide"> = ({ data, id }) => {
  const tips = lines(data.tips);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
      <SiteBuilder label={tips[0] ?? oneLine(data.heading)} />
      {tips.length > 0 && (
        <div className="mp-wd-panel mp-wd-gap">
          {tips.map((t, i) => (
            <Fold key={i} tile={i + 1} title={t} />
          ))}
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

/** "What we build": rows that open to their details · "More from We3vision": rows that open another app */
export const WebServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <div className="mp-wd-panel">
        {data.cards.map((c, i) => {
          if (related) {
            return (
              <AppLink key={i} href={c.href || "#contact"} className="mp-wd-row mp-wd-link">
                <Tile>
                  <IcGlobe />
                </Tile>
                <span className="mp-wd-body">
                  <b>
                    <Lines text={c.title} />
                  </b>
                  <span>{c.description}</span>
                </span>
                <IcChevron className="mp-wd-chev" />
              </AppLink>
            );
          }
          const problems = lines(c.problems);
          const outcomes = lines(c.outcomes);
          const more = c.fit || problems.length > 0 || outcomes.length > 0 || c.href;
          return (
            <Fold
              key={i}
              tile={i + 1}
              title={<Lines text={c.title} />}
              text={c.description}
            >
              {more ? (
                <>
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
                </>
              ) : undefined}
            </Fold>
          );
        })}
      </div>
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

/** the build process: one row per stage, numbered, open to read the points */
export const WebProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-wd-panel">
      {data.items.map((x, i) => (
        <Fold key={i} tile={i + 1} title={oneLine(x.title)}>
          <p>{x.text}</p>
          {lines(x.points).length > 0 && <Points items={lines(x.points)} />}
        </Fold>
      ))}
    </div>
  </Section>
);

/** the technologies as pills in one panel */
export const WebTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-wd-panel mp-wd-chipbox">
      <Clamp max="108px" more="Show all" less="Show fewer">
        <ul className="mp-wd-chips">
          {lines(data.items).map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Clamp>
    </div>
  </Section>
);

/** industries: a row each */
export const WebIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-wd-panel">
      {data.items.map((x, i) => (
        <Fold key={i} tile={<IcBuilding />} title={x.name}>
          <p>{x.description}</p>
        </Fold>
      ))}
    </div>
  </Section>
);

/** the advantages: a row each */
export const WebAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-wd-panel">
      {data.items.map((x, i) => (
        <Fold key={i} tile={<IcCheck />} title={x.title}>
          <p>{x.description}</p>
        </Fold>
      ))}
    </div>
  </Section>
);

/** the FAQ: the question is the row, the answer opens under it */
export const WebFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-wd-panel">
      {data.items.map((x, i) => (
        <Fold key={i} tile={<IcAsk />} title={x.question}>
          <p>{x.answer}</p>
        </Fold>
      ))}
    </div>
  </Section>
);

