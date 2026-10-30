import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Carousel, Cloud, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, lines, oneLine, pairs } from "../../../app/text";
import { CabinPicker, DeviceRow, RealityQuiz } from "../../../../lazy";

// /metaverse as a visionOS-style screen (iOS 27 kit, brain/16): one spatial glass window on top, glass only where it groups a tool
// (cabin picker, projects, devices, quiz), everything else open lists with hairlines. Regular type; 500 row titles, 600 headings.
// The 3D office walk of the laptop becomes the four cabins as a picker and the two government projects as windows. Same CMS words.
// Styles: (m)/m/metaverse/page.css.

const hue = (i: number) => ({ "--o": i * 36 }) as CSSProperties;
const rv = (i: number) => ({ "--rv-d": `${Math.min(i, 6) * 60}ms` }) as CSSProperties;

/** the welcome window: heading and text in spatial glass, the captions of the walk as floating subtitles */
export const VrHero: MobileSection<"vrEntry"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const caps = lines(data.captions);
  return (
    <section className="mp-vr-hero">
      <div className="mp-vr-window mp-vr-blur">
        <H className="mp-vr-h">
          <Lines text={data.heading} />
        </H>
        {data.text && <p className="mp-vr-t">{data.text}</p>}
      </div>
      <span className="mp-vr-grab" aria-hidden="true" />
      {caps.length > 0 && (
        <ul className="mp-vr-caps">
          {caps.map((c, i) => (
            <li key={i} className="mp-vr-blur" style={{ "--d": i * 0.9 + "s" } as CSSProperties}>
              {c}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

/** "Tech services we offer": the tip as an open note, the four cabins as a picker, then the government projects as windows */
export const VrFloor: MobileSection<"vrFloor"> = ({ data, id }) => (
  <>
    <Section id={id} title={data.heading}>
      {(data.tipTitle || data.tipText) && (
        <div className="mp-vr-note ma-rvx">
          <span className="mp-vr-note-dot" aria-hidden="true" />
          <div>
            {data.tipTitle && <h3>{data.tipTitle}</h3>}
            {data.tipText && <p>{data.tipText}</p>}
          </div>
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
          {data.projects.map((p, i) => {
            const steps = lines(p.steps);
            const tags = lines(p.tags);
            const team = pairs(p.team);
            return (
              <article key={i} className="mp-vr-glass mp-vr-gov ma-rvx" style={{ ...hue(i * 3), ...rv(i) }}>
                <div className="mp-vr-ph">
                  <span className="mp-vr-mark" aria-hidden="true">
                    {p.mark}
                  </span>
                  <div>
                    <p className="mp-vr-code">{[p.org, p.status].filter(Boolean).join(" · ")}</p>
                    {p.period && <p className="mp-vr-per">{p.period}</p>}
                  </div>
                </div>
                <h3>{p.title}</h3>
                {p.orgFull && <p className="mp-vr-p">{p.orgFull}</p>}
                {p.by && <p className="mp-vr-p">{p.by}</p>}
                {p.text && <p className="mp-vr-p">{p.text}</p>}
                {steps.length > 0 && (
                  <ol className="mp-vr-steps">
                    {steps.map((s, n) => (
                      <li key={n}>
                        <span aria-hidden="true">{n + 1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {tags.length > 0 && <Cloud items={tags} />}
                {team.length > 0 && (
                  <ul className="mp-vr-team">
                    {team.map((m, n) => (
                      <li key={n}>
                        <span className="mp-vr-team-n">{m.name}</span>
                        {m.text && <span className="mp-vr-team-r">{m.text}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </Section>
    )}
  </>
);

/** "The metaverse tech we build" = glass windows (AR/VR/XR/MR) that open; "More from We3vision" = an open list of rows */
export const VrServices: MobileSection<"services"> = ({ data, id }) => {
  const related = id === "related-services";
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {related ? (
        <ul className="mp-vr-rows">
          {data.cards.map((c, i) => (
            <li key={i} className="ma-rvx" style={rv(i)}>
              <AppLink href={c.href || "#contact"} className="mp-vr-row">
                <span>
                  <span className="mp-vr-row-t">
                    <Lines text={c.title} />
                  </span>
                  {c.description && <span className="mp-vr-row-d">{c.description}</span>}
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
                    <span className="mp-vr-sb-t">
                      <Lines text={c.title} />
                    </span>
                    {c.description && <span className="mp-vr-sb-d">{c.description}</span>}
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

/** the process as glowing orbs on a light path, open text (no boxes) */
export const VrProcess: MobileSection<"vrProcess"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-vr-path">
      {data.items.map((x, i) => {
        const pts = lines(x.points);
        return (
          <li key={i} className="ma-rvx" style={{ ...hue(i), ...rv(i) }}>
            <span className="mp-vr-orbn" aria-hidden="true">
              {i + 1}
            </span>
            <div className="mp-vr-step">
              <h3>{oneLine(x.title)}</h3>
              {x.text && <p className="mp-vr-p">{x.text}</p>}
              {pts.length > 0 && <Points items={pts} />}
            </div>
          </li>
        );
      })}
    </ol>
  </Section>
);

/** devices with the AR / VR / XR / MR segmented filter, one call to action, and the technology we work with as an open list */
export const VrDevices: MobileSection<"vrDevices"> = ({ data, id }) => {
  const codes = [...new Set(data.items.flatMap((d) => d.realities.split(/\s+/).filter(Boolean)))];
  const tools = lines(data.tools);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <DeviceRow items={data.items.map((d) => ({ ...d, tags: lines(d.tags) }))} codes={codes} />
      {tools.length > 0 && (
        <div className="mp-vr-tools ma-rvx">
          {data.toolsLabel && <p className="mp-vr-lab">{data.toolsLabel}</p>}
          <Cloud items={tools} />
        </div>
      )}
      {data.ctaLabel && (
        <div className="ma-actions">
          <Button href="#contact" block>
            {data.ctaLabel}
          </Button>
        </div>
      )}
    </Section>
  );
};

/** industries as an open list with hairlines */
export const VrIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-vr-list">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i)}>
          <h3>{x.name}</h3>
          {x.description && <p className="mp-vr-p">{x.description}</p>}
        </li>
      ))}
    </ul>
  </Section>
);

/** advantages as an open list, each with a small glowing orb */
export const VrAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-vr-list mp-vr-adv">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={{ ...hue(i), ...rv(i) }}>
          <span className="mp-vr-glow" aria-hidden="true" />
          <div>
            <h3>{x.title}</h3>
            {x.description && <p className="mp-vr-p">{x.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** the FAQ as an open list: question regular 17, a + that turns into − */
export const VrFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-vr-faq">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <span>{x.question}</span>
            <i className="mp-vr-plus" aria-hidden="true" />
          </summary>
          <p className="mp-vr-p">{x.answer}</p>
        </details>
      ))}
    </div>
  </Section>
);

/** "Which reality fits your idea?": the interactive quiz of the laptop, in one glass window with a glow ring */
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
