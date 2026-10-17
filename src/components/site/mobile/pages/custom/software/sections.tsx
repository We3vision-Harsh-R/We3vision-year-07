import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Carousel, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";

// /software-development-services as Xcode and Files: the hero is a code editor (line numbers, a tab, a Run button), the story a Quick Look
// document, the services folders, the process a project navigator tree, the industries Files tags, the questions a console.
// Same CMS words as the laptop. Styles: (m)/m/software-development-services/page.css.

const hue = (i: number) => ({ "--o": i * 47 }) as CSSProperties;
const nums = Array.from({ length: 9 }, (_, i) => i + 1);

/** the top: an editor window; the chip is the file tab, the first button is Run */
export const SwHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-sw-ide">
      <div className="mp-sw-tabs">
        <span className="mp-sw-file">
          <span className="mp-sw-braces" aria-hidden="true">
            {"{ }"}
          </span>
          {data.chip}
        </span>
        {data.primaryLabel && data.primaryHref && (
          <AppLink href={data.primaryHref} className="mp-sw-run">
            <span className="mp-sw-play" aria-hidden="true" />
            {data.primaryLabel}
          </AppLink>
        )}
      </div>
      <div className="mp-sw-code">
        <ol className="mp-sw-gutter" aria-hidden="true">
          {nums.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>
        <div className="mp-sw-src">
          <H className="mp-sw-h">
            <Lines text={data.heading} />
          </H>
          {data.text && <p className="mp-sw-t">{data.text}</p>}
          {data.secondaryLabel && data.secondaryHref && (
            <AppLink href={data.secondaryHref} className="mp-sw-link">
              {data.secondaryLabel}
              <IcChevron className="mp-sw-chev" />
            </AppLink>
          )}
        </div>
      </div>
    </section>
  );
};

/** the story as a Quick Look document */
export const SwStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <article className="mp-sw-doc">
      <span className="mp-sw-docic" aria-hidden="true" />
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </article>
  </section>
);

/** "What we build" = folders of Files; "More from We3vision" = Recents (document thumbnails that open the page) */
export const SwServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-sw-recent">
          {data.cards.map((c, i) => (
            <li key={i}>
              <AppLink href={c.href || "#contact"} className="mp-sw-thumb">
                <span className="mp-sw-paper" aria-hidden="true">
                  <i />
                  <i />
                  <i />
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
              <details key={i} className="mp-sw-folder" style={hue(i)}>
                <summary>
                  <span className="mp-sw-fic" aria-hidden="true" />
                  <span className="mp-sw-fb">
                    <b>
                      <Lines text={c.title} />
                    </b>
                    <span>{c.description}</span>
                  </span>
                  {more && <IcChevron className="mp-sw-chev" />}
                </summary>
                {more && (
                  <div className="mp-sw-fbody">
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

/** the life cycle as a project navigator: a tree, every stage a file, the points its children */
export const SwProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-sw-tree">
      {data.items.map((x, i) => (
        <li key={i}>
          <div className="mp-sw-node">
            <span className="mp-sw-n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{oneLine(x.title)}</h3>
          </div>
          <p>{x.text}</p>
          {lines(x.points).length > 0 && (
            <ul className="mp-sw-kids">
              {lines(x.points).map((p, n) => (
                <li key={n}>{p}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  </Section>
);

/** the technologies as linked frameworks */
export const SwTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-sw-libs">
      {lines(data.items).map((t, i) => (
        <li key={i}>
          <span className="mp-sw-box" aria-hidden="true" />
          {t}
        </li>
      ))}
    </ul>
  </Section>
);

/** the industries as Files tags: a coloured dot, the name, the text */
export const SwIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-sw-tags">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <span className="mp-sw-dot" aria-hidden="true" />
          <div>
            <b>{x.name}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the advantages as the inspector: a label on top, the value under it */
export const SwAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-sw-insp">
      {data.items.map((x, i) => (
        <section key={i}>
          <h3>{x.title}</h3>
          <p>{x.description}</p>
        </section>
      ))}
    </div>
  </Section>
);

/** the FAQ as a debug console: the question is the prompt, the answer the output */
export const SwFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-sw-con">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <span className="mp-sw-prompt" aria-hidden="true">
              &gt;
            </span>
            <span>{x.question}</span>
          </summary>
          <p>{x.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);
