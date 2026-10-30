import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Clamp, GroupedList, ListRow, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";
import { Ask, Flip, Prompt, RunSlider } from "../../../../lazy";

// /ai as an intelligence app (the look of Siri and Apple Intelligence): a glowing orb, a run that ticks off its steps, a switch between
// problem and answer, questions you tap, and a prompt box for the contact. Same CMS words as the laptop. Styles: (m)/m/ai/page.css ("mp-ai-").

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s()-]{6,}$/;
const rv = (i: number, step = 60) => ({ "--rv-d": `${i * step}ms` }) as CSSProperties;

const Spark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6-5.6-1.9 5.6-1.9L12 2.5zM18.5 15l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" />
  </svg>
);

/** the top: the glowing orb of an assistant, the heading, and the two buttons */
export const AiHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-ai-hero">
      <div className="mp-ai-orb" aria-hidden="true">
        <i />
        <i />
        <i />
        <Spark />
      </div>
      <span className="mp-ai-chip">{data.chip}</span>
      <H className="mp-ai-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-ai-t">{data.text}</p>}
      <div className="mp-ai-btns">
        {data.primaryLabel && data.primaryHref && (
          <AppLink href={data.primaryHref} className="mp-ai-btn is-main">
            {data.primaryLabel}
          </AppLink>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <AppLink href={data.secondaryHref} className="mp-ai-btn">
            {data.secondaryLabel}
          </AppLink>
        )}
      </div>
    </section>
  );
};

/** "How AI works for you": a prompt, then the agent ticks off its steps one by one */
export const AiFlow: MobileSection<"flow"> = ({ data }) => {
  const steps = lines(data.steps);
  return (
    <Section id="ai-flow" chip={data.chip} title={data.heading} intro={data.intro}>
      <div className="mp-ai-run">
        <p className="mp-ai-ask-me">
          <span>{data.triggerLabel}</span>
          {data.triggerText}
        </p>
        <div className="mp-ai-core">
          <span className="mp-ai-mini" aria-hidden="true">
            <Spark />
          </span>
          <b>{data.coreLabel}</b>
        </div>
        <RunSlider start={data.triggerLabel} steps={steps} />
        {data.runNote && <p className="mp-ai-note">{data.runNote}</p>}
      </div>
      {(data.sources.length > 0 || data.actions.length > 0) && (
        <dl className="mp-ai-io">
          {data.sources.length > 0 && (
            <div>
              <dt>{data.sourcesLabel}</dt>
              <dd>
                {data.sources.map((s) => (
                  <span key={s.label}>{s.label}</span>
                ))}
              </dd>
            </div>
          )}
          {data.actions.length > 0 && (
            <div>
              <dt>{data.actionsLabel}</dt>
              <dd>
                {data.actions.map((s) => (
                  <span key={s.label}>{s.label}</span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      )}
    </Section>
  );
};

/** "AI development means...": a summary card with the glowing edge of Apple Intelligence */
export const AiStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-ai-glow">
      <Clamp lines={6}>
        {paragraphs(data.body).map((p, i) => (
          <p key={i} className="mp-ai-p">
            <Rich text={p} />
          </p>
        ))}
      </Clamp>
    </div>
  </section>
);

/** "Ask the robot buddy": the tips as suggestions, a line each */
export const AiGuide: MobileSection<"guide"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
    <ul className="mp-ai-sug">
      {lines(data.tips).map((t, i) => (
        <li key={i} className="ma-rvx" style={rv(i)}>
          <Spark />
          <span>{t}</span>
        </li>
      ))}
    </ul>
    {data.buttonLabel && data.buttonHref && (
      <div className="ma-actions">
        <Button href={data.buttonHref} block>
          {data.buttonLabel}
        </Button>
      </div>
    )}
  </Section>
);

/** "Problems AI can take off your plate": one card per problem, a switch flips it to the answer */
export const AiAutomate: MobileSection<"automate"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ai-flips">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 70)}>
          <Flip before={x.problem} after={x.solution} left={data.beforeLabel} right={data.afterLabel} done={data.doneLabel || undefined} />
        </li>
      ))}
    </ul>
  </Section>
);

/** "What we build": tall gradient cards (like the "Today" cards of the App Store), each in its own colour; the details open under the title */
export const AiServices: MobileSection<"services"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-ai-cards" data-exclusive>
      {data.cards.map((c, i) => {
        const problems = lines(c.problems);
        const outcomes = lines(c.outcomes);
        const more = c.fit || problems.length > 0 || outcomes.length > 0 || c.href;
        return (
          <details key={i} className="mp-ai-card" style={{ "--off": ((i * 47) % 120) - 50 } as CSSProperties}>
            <summary>
              <span className="mp-ai-no">{String(i + 1).padStart(2, "0")}</span>
              <b>
                <Lines text={c.title} />
              </b>
              <span className="mp-ai-d">{c.description}</span>
              {more && <span className="mp-ai-plus" aria-hidden="true" />}
            </summary>
            {more && (
              <div className="mp-ai-more">
                {c.fit && (
                  <>
                    <p className="mp-ai-cap">Right for you when</p>
                    <p>{c.fit}</p>
                  </>
                )}
                {problems.length > 0 && (
                  <>
                    <p className="mp-ai-cap">Problems it solves</p>
                    <Points items={problems} />
                  </>
                )}
                {outcomes.length > 0 && (
                  <>
                    <p className="mp-ai-cap">What you get</p>
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
    {data.buttonLabel && data.buttonHref && (
      <div className="ma-actions">
        <Button href={data.buttonHref} block>
          {data.buttonLabel}
        </Button>
      </div>
    )}
  </Section>
);

/** "How we build your AI": a thread of steps, a line through the numbers */
export const AiProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-ai-log">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 50)}>
          <span className="mp-ai-logn">{i + 1}</span>
          <div>
            <h3>{oneLine(x.title)}</h3>
            <p>{x.text}</p>
            {lines(x.points).length > 0 && (
              <ul className="mp-ai-tags">
                {lines(x.points).map((p, n) => (
                  <li key={n}>{p}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** "The technology behind our AI": two slow rows of model names that drift sideways (still with "reduce motion") */
export const AiTags: MobileSection<"tags"> = ({ data, id }) => {
  const all = lines(data.items);
  const half = Math.ceil(all.length / 2);
  const rows = [all.slice(0, half), all.slice(half)].filter((r) => r.length > 0);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      <div className="mp-ai-models" aria-label={oneLine(data.heading)}>
        {rows.map((r, n) => (
          <div key={n} className={`mp-ai-track${n % 2 ? " is-back" : ""}`}>
            {[0, 1].map((k) => (
              <ul key={k} aria-hidden={k === 1 || undefined}>
                {r.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
};

/** "AI for every industry": tap an industry, the assistant answers under the chips */
export const AiIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <Ask items={data.items.map((x) => ({ name: x.name, description: x.description }))} />
  </Section>
);

/** "AI that actually solves problems": an open settings list (title and its line) with a switch that turns on as it comes into view */
export const AiAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ai-why">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i, 90)}>
          <div>
            <b>{x.title}</b>
            {x.description && <p>{x.description}</p>}
          </div>
          <span className="mp-ai-switch" aria-hidden="true" />
        </li>
      ))}
    </ul>
  </Section>
);

/** FAQ: an open list; the question is a regular line, a + turns into − and the answer opens under it */
export const AiFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ai-qa" data-exclusive>
      {data.items.map((x, i) => (
        <li key={i}>
          <details>
            <summary>
              <span>{x.question}</span>
              <i className="mp-ai-pm" aria-hidden="true" />
            </summary>
            <p>{x.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  </Section>
);

/** Contact: the prompt box of an assistant, then the phone and e-mail cards folded away */
export const AiContact: MobileSection<"contact"> = ({ data, site }) => (
  <Section id="contact" chip={data.chip} title={data.heading} intro={data.text}>
    <Prompt label={data.buttonLabel || undefined} />
    <details className="ma-fold ma-gap">
      <summary>
        Phone, e-mail and offices
        <IcChevron />
      </summary>
      <div className="ma-stack ma-gap">
        {site.contactCards.map((card, i) => (
          <GroupedList key={i} header={card.title}>
            {lines(card.lines).map((l, n) => (
              <ListRow key={n} title={l} href={EMAIL.test(l) ? "mailto:" + l : PHONE.test(l) ? "tel:" + l.replace(/[^\d+]/g, "") : undefined} />
            ))}
          </GroupedList>
        ))}
      </div>
    </details>
  </Section>
);
