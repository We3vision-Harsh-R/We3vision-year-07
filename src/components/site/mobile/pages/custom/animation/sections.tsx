import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Carousel, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { BallTimeline } from "./timeline";

// /animation as Clips and Apple TV: the hero is a cinematic poster with letterbox bars and a Play button, the story a synopsis, the services episode
// rows with a thumbnail, the process a film strip, the tools end credits, the industries a poster carousel. The timeline of the laptop is real.
// Same CMS words. Styles: (m)/m/animation/page.css.

const hue = (i: number) => ({ "--o": i * 41 }) as CSSProperties;

/** the top: a poster between two letterbox bars; the first button is Play */
export const AnHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-an-poster">
      <div className="mp-an-bar">
        <span className="mp-an-badge">{data.chip}</span>
      </div>
      <div className="mp-an-art">
        <span className="mp-an-orb" aria-hidden="true" />
        <H className="mp-an-h">
          <Lines text={data.heading} />
        </H>
      </div>
      <div className="mp-an-bar is-low">
        {data.text && <p className="mp-an-t">{data.text}</p>}
        <div className="mp-an-acts">
          {data.primaryLabel && data.primaryHref && (
            <AppLink href={data.primaryHref} className="mp-an-playbtn">
              <span className="mp-an-tri" aria-hidden="true" />
              {data.primaryLabel}
            </AppLink>
          )}
          {data.secondaryLabel && data.secondaryHref && (
            <AppLink href={data.secondaryHref} className="mp-an-up">
              {data.secondaryLabel}
            </AppLink>
          )}
        </div>
      </div>
    </section>
  );
};

/** the story as the synopsis under a progress line */
export const AnStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-an-syn">
      <span className="mp-an-prog" aria-hidden="true" />
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  </section>
);

/** "Press play, scrub the frames": a bouncing ball and its timeline */
export const AnGuide: MobileSection<"guide"> = ({ data, id }) => {
  const tips = lines(data.tips);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
      <BallTimeline label={tips[0] ?? oneLine(data.heading)} />
      {tips.map((t, i) => (
        <p key={i} className="mp-an-sub">
          {t}
        </p>
      ))}
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

/** "Our animation services" = episodes (a thumbnail, the title; open for the details); "More from We3vision" = a row of landscape thumbnails */
export const AnServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-an-also">
          {data.cards.map((c, i) => (
            <li key={i} style={hue(i + 1)}>
              <AppLink href={c.href || "#contact"} className="mp-an-thumb">
                <span className="mp-an-th" aria-hidden="true">
                  <span className="mp-an-tri" />
                </span>
                <b>
                  <Lines text={c.title} />
                </b>
                <span>{c.description}</span>
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <Carousel>
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            const more = c.fit || problems.length > 0 || outcomes.length > 0 || c.href;
            return (
              <details key={i} className="mp-an-ep" style={hue(i)}>
                <summary>
                  <span className="mp-an-th" aria-hidden="true">
                    <span className="mp-an-tri" />
                  </span>
                  <span className="mp-an-eb">
                    <b>
                      <Lines text={c.title} />
                    </b>
                    <span>{c.description}</span>
                  </span>
                  {more && <IcChevron className="mp-an-chev" />}
                </summary>
                {more && (
                  <div className="mp-an-ebody">
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
                )}
              </details>
            );
          })}
        </Carousel>
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

/** the process as a film strip: a sprocket edge and a frame per step */
export const AnProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-an-strip">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <span className="mp-an-fn">{String(i + 1).padStart(2, "0")}</span>
          <div className="mp-an-frame">
            <h3>{oneLine(x.title)}</h3>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && <Points items={lines(x.points)} />}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** the tools as end credits */
export const AnTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-an-credits">
      {lines(data.items).map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  </Section>
);

/** the industries as a carousel of portrait posters */
export const AnIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-an-posters">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <b>{x.name}</b>
          <p>{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** the advantages as an info sheet: a round mark, the title, the text */
export const AnAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-an-info">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-an-mark" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <b>{x.title}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ as the audio and subtitles list: a CC badge, the question, the answer opens */
export const AnFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-an-cc">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <span className="mp-an-ccb" aria-hidden="true">
              CC
            </span>
            <span className="mp-an-q">{x.question}</span>
            <IcChevron className="mp-an-chev" />
          </summary>
          <p>{x.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);
