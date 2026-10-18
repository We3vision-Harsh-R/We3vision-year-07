import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { WireToDesign } from "./toggle";

// /ui-ux-design in iOS 27, a quiet Freeform: open space, hairlines, regular type (500 only for row titles, 600 for headings).
// The hero title sits as a selected object on the canvas (thin outline, four handles); the one tool is the wireframe-to-design switch
// on a glass board. Colour swatches stand in for the frames. Same CMS words as the laptop. Styles: (m)/m/ui-ux-design/page.css ("mp-ux-").

const rv = (i: number, step = 60) => ({ "--rv-d": `${i * step}ms`, "--o": i * 44 }) as CSSProperties;

/** the top: a frame label, the title as a selected object, the text, two buttons side by side */
export const UxHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-ux-hero">
      <p className="mp-ux-frame-l">
        <i aria-hidden="true" />
        {data.chip}
      </p>
      <div className="mp-ux-sel">
        <i aria-hidden="true" /> <i aria-hidden="true" /> <i aria-hidden="true" /> <i aria-hidden="true" />
        <H className="mp-ux-h">
          <Lines text={data.heading} />
        </H>
      </div>
      {data.text && <p className="mp-ux-t">{data.text}</p>}
      <div className="mp-ux-btns">
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
export const UxStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-ux-story">
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  </section>
);

/** "From wireframe to final design": one glass board and one switch */
export const UxGuide: MobileSection<"guide"> = ({ data, id }) => {
  const tips = lines(data.tips);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
      <WireToDesign label={tips[0] ?? oneLine(data.heading)} />
      {tips.length > 1 && (
        <ul className="mp-ux-tips">
          {tips.slice(1).map((t, i) => (
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

/** "What we design" = an open list: a colour swatch, the name, one line, open for the details; "More from We3vision" = quiet links */
export const UxServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-ux-links">
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
        <ul className="mp-ux-list" data-exclusive>
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return (
              <li key={i} className="ma-rvx" style={rv(i, 50)}>
                <details>
                  <summary>
                    <span className="mp-ux-sw-dot" aria-hidden="true" />
                    <span className="mp-ux-row">
                      <b>
                        <Lines text={c.title} />
                      </b>
                      <small>{c.description}</small>
                    </span>
                    <i className="mp-ux-pm" aria-hidden="true" />
                  </summary>
                  <div className="mp-ux-more">
                    {c.fit && (
                      <>
                        <p className="mp-ux-lab">Right for you when</p>
                        <p>{c.fit}</p>
                      </>
                    )}
                    {problems.length > 0 && (
                      <>
                        <p className="mp-ux-lab">Problems it solves</p>
                        <Points items={problems} />
                      </>
                    )}
                    {outcomes.length > 0 && (
                      <>
                        <p className="mp-ux-lab">What you get</p>
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
export const UxProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-ux-flow">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i)}>
          <span className="mp-ux-node" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3>{oneLine(x.title)}</h3>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && <p className="mp-ux-pts">{lines(x.points).join("  ·  ")}</p>}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** the tool stack as one line of text */
export const UxTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <p className="mp-ux-stack">
      {lines(data.items).map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </p>
  </Section>
);

/** the industries as an open list, each with its own swatch */
export const UxIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ux-ind">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 50)}>
          <span className="mp-ux-sw-dot" aria-hidden="true" />
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
export const UxAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-ux-why">
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
export const UxFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ux-qa" data-exclusive>
      {data.items.map((x, i) => (
        <li key={i}>
          <details>
            <summary>
              <span>{x.question}</span>
              <i className="mp-ux-pm" aria-hidden="true" />
            </summary>
            <p>{x.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  </Section>
);
