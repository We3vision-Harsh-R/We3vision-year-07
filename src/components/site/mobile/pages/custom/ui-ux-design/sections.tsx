import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Carousel, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { WireToDesign } from "./toggle";

// /ui-ux-design as a Freeform board: a dotted canvas, sticky notes with a slight tilt, frames with a label tab, a flow chart with connectors,
// comment pins for the questions. The wireframe-to-design switch of the laptop is a real switch. Same CMS words. Styles: (m)/m/ui-ux-design/page.css.

const hue = (i: number) => ({ "--o": i * 44, "--t": (i % 2 ? 1 : -1) * (0.6 + (i % 3) * 0.5) + "deg" }) as CSSProperties;

/** the top: the title sits on the canvas as a selected object (handles on its corners); the buttons are two shapes */
export const UxHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-ux-canvas">
      <span className="mp-ux-label">{data.chip}</span>
      <div className="mp-ux-sel">
        <i /> <i /> <i /> <i />
        <H className="mp-ux-h">
          <Lines text={data.heading} />
        </H>
      </div>
      {data.text && <p className="mp-ux-t">{data.text}</p>}
      <div className="mp-ux-shapes">
        {data.primaryLabel && data.primaryHref && (
          <AppLink href={data.primaryHref} className="mp-ux-shape is-rect">
            {data.primaryLabel}
          </AppLink>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <AppLink href={data.secondaryHref} className="mp-ux-shape is-pill">
            {data.secondaryLabel}
          </AppLink>
        )}
      </div>
    </section>
  );
};

/** the story on sticky notes */
export const UxStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-ux-stickies">
      {paragraphs(data.body).map((p, i) => (
        <article key={i} style={hue(i)}>
          <span className="mp-ux-tape" aria-hidden="true" />
          <p>
            <Rich text={p} />
          </p>
        </article>
      ))}
    </div>
  </section>
);

/** "From wireframe to final design": one frame and a switch */
export const UxGuide: MobileSection<"guide"> = ({ data, id }) => {
  const tips = lines(data.tips);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
      <WireToDesign label={tips[0] ?? oneLine(data.heading)} />
      {tips.slice(1).map((t, i) => (
        <p key={i} className="mp-ux-tip">
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

/** "What we design" = frames with a label tab; "More from We3vision" = cards joined to the board by a connector dot */
export const UxServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-ux-rel">
          {data.cards.map((c, i) => (
            <li key={i} style={hue(i)}>
              <AppLink href={c.href || "#contact"} className="mp-ux-relc">
                <i aria-hidden="true" />
                <span>
                  <b>
                    <Lines text={c.title} />
                  </b>
                  <span>{c.description}</span>
                </span>
                <IcChevron className="mp-ux-chev" />
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <Carousel>
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            return (
              <details key={i} className="mp-ux-fr" style={hue(i)}>
                <summary>
                  <span className="mp-ux-ftab">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mp-ux-fh">
                    <b>
                      <Lines text={c.title} />
                    </b>
                    <span>{c.description}</span>
                  </span>
                  <IcChevron className="mp-ux-chev" />
                </summary>
                <div className="mp-ux-fbody">
                  {c.fit && (
                    <p className="mp-ux-note">
                      <b>Right for you when</b>
                      {c.fit}
                    </p>
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

/** the process as a flow chart: boxes joined by arrows */
export const UxProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-ux-flow">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <div className="mp-ux-box">
            <span className="mp-ux-n">{i + 1}</span>
            <h3>{oneLine(x.title)}</h3>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && <Points items={lines(x.points)} />}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** the tool stack as stickers */
export const UxTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ux-stickers">
      {lines(data.items).map((t, i) => (
        <li key={i} style={hue(i)}>
          {t}
        </li>
      ))}
    </ul>
  </Section>
);

/** the industries on a sideways row of sticky notes */
export const UxIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ux-row">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <b>{x.name}</b>
          <p>{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** the advantages with a highlighter under each title */
export const UxAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ux-marks">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <b>
            <span>{x.title}</span>
          </b>
          <p>{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ as comments on the board: a numbered pin, the question, the answer opens under it */
export const UxFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-ux-comments">
      {data.items.map((x, i) => (
        <details key={i} style={hue(i)}>
          <summary>
            <span className="mp-ux-pin">{i + 1}</span>
            <span className="mp-ux-q">{x.question}</span>
            <IcChevron className="mp-ux-chev" />
          </summary>
          <p>{x.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);
