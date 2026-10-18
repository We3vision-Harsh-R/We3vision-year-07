import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { BallTimeline } from "./timeline";

// /animation in iOS 27, a quiet Final Cut / Clips: open space, hairlines, regular type (500 for row titles, 600 for headings).
// The hero has a record light and a playhead that runs along a clip; the one tool is the bouncing-ball timeline on a glass viewer
// (play, scrub, keyframes); the services and industries carry small clip thumbnails; the process is a track of clips. Same CMS words.
// Styles: (m)/m/animation/page.css ("mp-an-").

const rv = (i: number, step = 60) => ({ "--rv-d": `${i * step}ms`, "--o": i * 41 }) as CSSProperties;

/** the top: a record light and the chip, the title, a playhead running along a clip, the text, Play and the second button */
export const AnHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-an-hero">
      <p className="mp-an-rec">
        <i aria-hidden="true" />
        {data.chip}
      </p>
      <H className="mp-an-h">
        <Lines text={data.heading} />
      </H>
      <span className="mp-an-scrub" aria-hidden="true">
        <i />
      </span>
      {data.text && <p className="mp-an-t">{data.text}</p>}
      <div className="mp-an-btns">
        {data.primaryLabel && data.primaryHref && (
          <AppLink href={data.primaryHref} className="ma-btn ma-btn-fill">
            <span className="mp-an-tri" aria-hidden="true" />
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
export const AnStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-an-story">
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  </section>
);

/** "Press play, scrub the frames": the bouncing ball on a glass viewer */
export const AnGuide: MobileSection<"guide"> = ({ data, id }) => {
  const tips = lines(data.tips);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
      <BallTimeline label={tips[0] ?? oneLine(data.heading)} />
      {tips.length > 0 && (
        <ul className="mp-an-tips">
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

/** The services = an open list: a clip thumbnail, the name, one line, open for the details; "More from We3vision" = quiet links */
export const AnServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-an-links">
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
        <ul className="mp-an-list" data-exclusive>
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return (
              <li key={i} className="ma-rvx" style={rv(i, 50)}>
                <details>
                  <summary>
                    <span className="mp-an-th" aria-hidden="true" />
                    <span className="mp-an-row">
                      <b>
                        <Lines text={c.title} />
                      </b>
                      <small>{c.description}</small>
                    </span>
                    <i className="mp-an-pm" aria-hidden="true" />
                  </summary>
                  <div className="mp-an-more">
                    {c.fit && (
                      <>
                        <p className="mp-an-lab">Right for you when</p>
                        <p>{c.fit}</p>
                      </>
                    )}
                    {problems.length > 0 && (
                      <>
                        <p className="mp-an-lab">Problems it solves</p>
                        <Points items={problems} />
                      </>
                    )}
                    {outcomes.length > 0 && (
                      <>
                        <p className="mp-an-lab">What you get</p>
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

/** the process as a track of clips: a numbered clip, a thin track line between them */
export const AnProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-an-flow">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i)}>
          <span className="mp-an-node" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3>{oneLine(x.title)}</h3>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && <p className="mp-an-pts">{lines(x.points).join("  ·  ")}</p>}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** the tool stack as one line of text */
export const AnTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <p className="mp-an-stack">
      {lines(data.items).map((t, i) => (
        <span key={i}>{t}</span>
      ))}
    </p>
  </Section>
);

/** the industries as an open list, each with a small clip thumbnail */
export const AnIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-an-ind">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 50)}>
          <span className="mp-an-th" aria-hidden="true" />
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
export const AnAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-an-why">
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
export const AnFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-an-qa" data-exclusive>
      {data.items.map((x, i) => (
        <li key={i}>
          <details>
            <summary>
              <span>{x.question}</span>
              <i className="mp-an-pm" aria-hidden="true" />
            </summary>
            <p>{x.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  </Section>
);
