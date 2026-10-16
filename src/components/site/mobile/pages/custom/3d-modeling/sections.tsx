import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";

// /3d-modeling as AR Quick Look: the hero is a camera view with an object on a placement ring and a sheet below, the services model cards with a
// small solid (cube, sphere, pyramid, ring: CSS shapes, no 3D engine), the process a measuring tape, the advantages annotation callouts.
// Same CMS words as the laptop. Styles: (m)/m/3d-modeling/page.css.

const SHAPES = ["cube", "sphere", "pyramid", "ring"] as const;
const hue = (i: number) => ({ "--o": i * 33 }) as CSSProperties;

/** a small solid; purely decorative */
function Solid({ i, big }: { i: number; big?: boolean }) {
  return <span className={"mp-3d-solid" + (big ? " is-big" : "")} data-shape={SHAPES[i % SHAPES.length]} style={hue(i)} aria-hidden="true" />;
}

/** the top: a camera view, the object on its placement ring, the title in the bar and the text on a sheet */
export const ArHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-3d-cam">
      <div className="mp-3d-view">
        <span className="mp-3d-title">{data.chip}</span>
        <span className="mp-3d-br is-tl" aria-hidden="true" />
        <span className="mp-3d-br is-tr" aria-hidden="true" />
        <span className="mp-3d-br is-bl" aria-hidden="true" />
        <span className="mp-3d-br is-br" aria-hidden="true" />
        <div className="mp-3d-stage">
          <Solid i={0} big />
          <span className="mp-3d-ring" aria-hidden="true" />
        </div>
      </div>
      <div className="mp-3d-sheet">
        <span className="mp-3d-grab" aria-hidden="true" />
        <H className="mp-3d-h">
          <Lines text={data.heading} />
        </H>
        {data.text && <p className="mp-3d-t">{data.text}</p>}
        <div className="mp-3d-acts">
          {data.primaryLabel && data.primaryHref && (
            <AppLink href={data.primaryHref} className="mp-3d-done">
              {data.primaryLabel}
            </AppLink>
          )}
          {data.secondaryLabel && data.secondaryHref && (
            <AppLink href={data.secondaryHref} className="mp-3d-alt">
              {data.secondaryLabel}
            </AppLink>
          )}
        </div>
      </div>
    </section>
  );
};

/** the story on an info sheet */
export const ArStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-3d-info">
      <span className="mp-3d-grab" aria-hidden="true" />
      {paragraphs(data.body).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
    </div>
  </section>
);

/** "Our 3D services" = model cards, each with its own small solid; "More from We3vision" = a grid of objects that link */
export const ArServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-3d-objs">
          {data.cards.map((c, i) => (
            <li key={i}>
              <AppLink href={c.href || "#contact"} className="mp-3d-obj">
                <Solid i={i + 1} />
                <b>
                  <Lines text={c.title} />
                </b>
                <span>{c.description}</span>
              </AppLink>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mp-3d-models ma-grid2">
          {data.cards.map((c, i) => {
            const problems = lines(c.problems);
            const outcomes = lines(c.outcomes);
            const more = c.fit || problems.length > 0 || outcomes.length > 0 || c.href;
            return (
              <details key={i} className="mp-3d-model" open={i === 0}>
                <summary>
                  <Solid i={i} />
                  <span className="mp-3d-mb">
                    <b>
                      <Lines text={c.title} />
                    </b>
                    <span>{c.description}</span>
                  </span>
                  {more && <IcChevron className="mp-3d-chev" />}
                </summary>
                {more && (
                  <div className="mp-3d-mbody">
                    {c.fit && (
                      <>
                        <p className="mp-3d-lab">Right for you when</p>
                        <p>{c.fit}</p>
                      </>
                    )}
                    {problems.length > 0 && (
                      <>
                        <p className="mp-3d-lab">Problems it solves</p>
                        <Points items={problems} />
                      </>
                    )}
                    {outcomes.length > 0 && (
                      <>
                        <p className="mp-3d-lab">What you get</p>
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

/** the process as a measuring tape: ticks down the left edge, a step beside each */
export const ArProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-3d-tape">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-3d-flag">{i + 1}</span>
          <div className="mp-3d-step">
            <h3>{oneLine(x.title)}</h3>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && <Points items={lines(x.points)} />}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** the tools as an object library */
export const ArTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-3d-lib">
      {lines(data.items).map((t, i) => (
        <li key={i}>
          <Solid i={i + 2} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  </Section>
);

/** the industries: a capsule with a solid, the text under it */
export const ArIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-3d-ind">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-3d-cap">
            <Solid i={i + 1} />
            <b>{x.name}</b>
          </span>
          <p>{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** the advantages as annotation callouts: a dot on the object, a leader line, a label */
export const ArAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-3d-call">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-3d-pt" aria-hidden="true" />
          <div>
            <b>{x.title}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ as the rows of an info sheet */
export const ArFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-3d-faq">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <Solid i={i} />
            <span className="mp-3d-q">{x.question}</span>
            <IcChevron className="mp-3d-chev" />
          </summary>
          <p>{x.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);
