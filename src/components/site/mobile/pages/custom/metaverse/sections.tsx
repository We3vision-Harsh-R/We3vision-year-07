import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Carousel, Cloud, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, lines, oneLine, pairs } from "../../../app/text";
import { CabinPicker, DeviceRow, RealityQuiz } from "./interactive";

// /metaverse as a visionOS-style screen (no 3D): glass windows with a bright rim and a grabber, round "ornament" buttons, floating captions.
// The 3D office walk of the laptop becomes the four cabins as a picker and the two government projects as windows. Same CMS words.
// Styles: (m)/m/metaverse/page.css.

const hue = (i: number) => ({ "--o": i * 36 }) as CSSProperties;

/** the welcome window: heading and text, the captions of the walk as floating subtitles */
export const VrHero: MobileSection<"vrEntry"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const caps = lines(data.captions);
  return (
    <section className="mp-vr-hero">
      <div className="mp-vr-window">
        <H className="mp-vr-h">
          <Lines text={data.heading} />
        </H>
        {data.text && <p className="mp-vr-t">{data.text}</p>}
        <span className="mp-vr-grab" aria-hidden="true" />
      </div>
      {caps.length > 0 && (
        <ul className="mp-vr-caps">
          {caps.map((c, i) => (
            <li key={i} style={{ "--d": i * 0.9 + "s" } as CSSProperties}>
              {c}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

/** "Tech services we offer": the four cabins as a picker, then the government projects as windows */
export const VrFloor: MobileSection<"vrFloor"> = ({ data, id }) => (
  <>
    <Section id={id} title={data.heading}>
      {(data.tipTitle || data.tipText) && (
        <div className="mp-vr-tip">
          {data.tipTitle && <h3>{data.tipTitle}</h3>}
          {data.tipText && <p>{data.tipText}</p>}
        </div>
      )}
      {data.cabins.length > 0 && (
        <CabinPicker
          cabins={data.cabins.map((c) => ({ code: c.code, name: c.name, text: c.text, industries: lines(c.industries) }))}
          industriesTitle={data.industriesTitle}
          ctaLabel={data.ctaLabel}
        />
      )}
    </Section>
    {data.projects.length > 0 && (
      <Section title={data.govTitle}>
        <div className="mp-vr-wins ma-grid2">
          {data.projects.map((p, i) => (
            <article key={i} className="mp-vr-glass mp-vr-proj-card" style={hue(i * 3)}>
              <div className="mp-vr-ph">
                <span className="mp-vr-mark">{p.mark}</span>
                <div>
                  <p className="mp-vr-code">{[p.org, p.status].filter(Boolean).join(" · ")}</p>
                  {p.period && <p className="mp-vr-per">{p.period}</p>}
                </div>
              </div>
              <h3>{p.title}</h3>
              {p.orgFull && <p className="mp-vr-p">{p.orgFull}</p>}
              {p.by && <p className="mp-vr-p">{p.by}</p>}
              {p.text && <p className="mp-vr-p">{p.text}</p>}
              {lines(p.steps).length > 0 && (
                <ol className="mp-vr-stages">
                  {lines(p.steps).map((s, n) => (
                    <li key={n}>
                      <span aria-hidden="true">{n + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              )}
              {lines(p.tags).length > 0 && <Cloud items={lines(p.tags)} />}
              {lines(p.team).length > 0 && (
                <ul className="mp-vr-team">
                  {pairs(p.team).map((m, n) => (
                    <li key={n}>
                      <b>{m.name}</b>
                      {m.text && <span>{m.text}</span>}
                    </li>
                  ))}
                </ul>
              )}
              <span className="mp-vr-grab" aria-hidden="true" />
            </article>
          ))}
        </div>
      </Section>
    )}
  </>
);

/** "The metaverse tech we build" = windows (AR/VR/XR/MR) that open; "More from We3vision" = ornament links */
export const VrServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-vr-links">
          {data.cards.map((c, i) => (
            <li key={i}>
              <AppLink href={c.href || "#contact"} className="mp-vr-link">
                <span>
                  <b>
                    <Lines text={c.title} />
                  </b>
                  <span>{c.description}</span>
                </span>
                <IcChevron className="mp-vr-chev" />
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
              <details key={i} className="mp-vr-glass mp-vr-svc" style={hue(i * 2)}>
                <summary>
                  <span className="mp-vr-sb">
                    <b>
                      <Lines text={c.title} />
                    </b>
                    <span>{c.description}</span>
                  </span>
                  <IcChevron className="mp-vr-chev" />
                </summary>
                <div className="mp-vr-sbody">
                  {c.fit && (
                    <>
                      <p className="mp-vr-lab">Right for you when</p>
                      <p className="mp-vr-p">{c.fit}</p>
                    </>
                  )}
                  {problems.length > 0 && (
                    <>
                      <p className="mp-vr-lab">Problems it solves</p>
                      <Points items={problems} />
                    </>
                  )}
                  {outcomes.length > 0 && (
                    <>
                      <p className="mp-vr-lab">What you get</p>
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

/** the process as orbs on a path */
export const VrProcess: MobileSection<"vrProcess"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-vr-path">
      {data.items.map((x, i) => (
        <li key={i} style={hue(i)}>
          <span className="mp-vr-orbn">{i + 1}</span>
          <div className="mp-vr-glass">
            <h3>{oneLine(x.title)}</h3>
            <p className="mp-vr-p">{x.text}</p>
            {lines(x.points).length > 0 && <Points items={lines(x.points)} />}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** devices with the AR / VR / XR / MR filter, and the technology we work with */
export const VrDevices: MobileSection<"vrDevices"> = ({ data, id }) => {
  const codes = [...new Set(data.items.flatMap((d) => d.realities.split(/\s+/).filter(Boolean)))];
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <DeviceRow items={data.items.map((d) => ({ ...d, tags: lines(d.tags) }))} codes={codes} ctaLabel={data.ctaLabel} />
      {lines(data.tools).length > 0 && (
        <div className="mp-vr-glass mp-vr-tools">
          <p className="mp-vr-lab">{data.toolsLabel}</p>
          <Cloud items={lines(data.tools)} />
        </div>
      )}
    </Section>
  );
};

/** industries as one glass list */
export const VrIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-vr-list mp-vr-glass">
      {data.items.map((x, i) => (
        <li key={i}>
          <b>{x.name}</b>
          <p className="mp-vr-p">{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** advantages as glass tiles with a glowing orb */
export const VrAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-vr-adv">
      {data.items.map((x, i) => (
        <li key={i} className="mp-vr-glass" style={hue(i)}>
          <span className="mp-vr-glow" aria-hidden="true" />
          <b>{x.title}</b>
          <p className="mp-vr-p">{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ in glass rows that open */
export const VrFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-vr-faq mp-vr-glass">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <span>{x.question}</span>
            <IcChevron className="mp-vr-chev" />
          </summary>
          <p className="mp-vr-p">{x.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);

/** "Which reality fits your idea?": the interactive quiz of the laptop, in a glass window */
export const VrQuiz: MobileSection<"vrQuiz"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <RealityQuiz
      startLabel={data.startLabel}
      restartLabel={data.restartLabel}
      ctaLabel={data.ctaLabel}
      questions={data.questions.map((q) => ({
        question: q.question,
        options: lines(q.options).map((l) => {
          const i = l.lastIndexOf("|");
          return { label: (i < 0 ? l : l.slice(0, i)).trim(), codes: i < 0 ? [] : l.slice(i + 1).trim().split(/\s+/).filter(Boolean) };
        }),
      }))}
      results={data.results}
    />
  </Section>
);
