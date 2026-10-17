import type { ReactNode } from "react";
import type { MobileSection } from "../../types";
import { AppLink, Button, Carousel, Cloud, Points, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines, Rich, lines, oneLine, paragraphs } from "../../../app/text";

// /ai as an assistant app: every section is a conversation. The hero is the assistant's first message with quick replies, "how it works" is
// one run of an agent (message, tool calls, answer), the problems are user/assistant pairs. Same CMS words as the laptop. Styles: (m)/m/ai/page.css.

/** the assistant's avatar: a spark on a gradient tile */
function Avatar() {
  return (
    <span className="mp-ai-av" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6-5.6-1.9 5.6-1.9L12 2.5zM18.5 15l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" />
      </svg>
    </span>
  );
}

/** an assistant message: avatar and a bubble */
function Say({ children, who }: { children: ReactNode; who?: string }) {
  return (
    <div className="mp-ai-msg">
      <Avatar />
      <div className="mp-ai-bub">
        {who && <p className="mp-ai-who">{who}</p>}
        {children}
      </div>
    </div>
  );
}

/** the top: the first message of the assistant, the two buttons of the laptop as quick replies */
export const AiHero: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-ai-hero">
      <div className="mp-ai-top">
        <Avatar />
        <span className="mp-ai-chip">{data.chip}</span>
      </div>
      <H className="mp-ai-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-ai-t">{data.text}</p>}
      <div className="mp-ai-replies">
        {data.primaryLabel && data.primaryHref && (
          <AppLink href={data.primaryHref} className="mp-ai-reply is-main">
            {data.primaryLabel}
          </AppLink>
        )}
        {data.secondaryLabel && data.secondaryHref && (
          <AppLink href={data.secondaryHref} className="mp-ai-reply">
            {data.secondaryLabel}
          </AppLink>
        )}
      </div>
    </section>
  );
};

/** "How AI works for you": one run of the agent as a chat */
export const AiFlow: MobileSection<"flow"> = ({ data, id }) => {
  const steps = lines(data.steps);
  return (
    <Section id="ai-flow" chip={data.chip} title={data.heading} intro={data.intro}>
      <div className="mp-ai-thread" data-id={id}>
        <div className="mp-ai-me">
          <span className="mp-ai-cap">{data.triggerLabel}</span>
          <p>{data.triggerText}</p>
        </div>
        <div className="mp-ai-run">
          <div className="mp-ai-runh">
            <Avatar />
            <b>{data.coreLabel}</b>
          </div>
          <ol className="mp-ai-tools">
            {steps.map((s, i) => (
              <li key={i}>
                <span className="mp-ai-tick" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ol>
          {data.runNote && <p className="mp-ai-note">{data.runNote}</p>}
        </div>
        {data.sources.length > 0 && (
          <div className="mp-ai-chipbox">
            <p className="mp-ai-cap">
              {data.sourcesLabel}
              {data.sourcesNote ? " · " + data.sourcesNote : ""}
            </p>
            <Cloud items={data.sources.map((s) => s.label)} />
          </div>
        )}
        {data.actions.length > 0 && (
          <div className="mp-ai-chipbox is-act">
            <p className="mp-ai-cap">
              {data.actionsLabel}
              {data.actionsNote ? " · " + data.actionsNote : ""}
            </p>
            <Cloud items={data.actions.map((s) => s.label)} />
          </div>
        )}
      </div>
    </Section>
  );
};

/** "AI development means...": the assistant explains, in two messages */
export const AiStory: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <div className="mp-ai-stack">
      {paragraphs(data.body).map((p, i) => (
        <Say key={i}>
          <p className="mp-ai-p">
            <Rich text={p} />
          </p>
        </Say>
      ))}
    </div>
  </section>
);

/** "Ask the robot buddy": the tips as the assistant's messages (the laptop robot says them one by one) */
export const AiGuide: MobileSection<"guide"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
    <div className="mp-ai-stack">
      {lines(data.tips).map((t, i) => (
        <Say key={i}>
          <p className="mp-ai-p">{t}</p>
        </Say>
      ))}
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

/** "Problems AI can take off your plate": a problem (you) and the solution (assistant) per row */
export const AiAutomate: MobileSection<"automate"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ai-pairs">
      {data.items.map((x, i) => (
        <li key={i}>
          <div className="mp-ai-me">
            <span className="mp-ai-cap">{data.beforeLabel}</span>
            <p>{x.problem}</p>
          </div>
          <Say who={data.afterLabel}>
            <p className="mp-ai-p">{x.solution}</p>
            {data.doneLabel && <span className="mp-ai-done">{data.doneLabel}</span>}
          </Say>
        </li>
      ))}
    </ul>
  </Section>
);

/** "What we build": agent cards; the details open under each card */
export const AiServices: MobileSection<"services"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <Carousel>
      {data.cards.map((c, i) => {
        const problems = lines(c.problems);
        const outcomes = lines(c.outcomes);
        const more = c.fit || problems.length > 0 || outcomes.length > 0;
        return (
          <details key={i} className="mp-ai-agent">
            <summary>
              <span className="mp-ai-agent-ic" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mp-ai-agent-b">
                <b>
                  <Lines text={c.title} />
                </b>
                <span>{c.description}</span>
              </span>
              {more && <IcChevron className="mp-ai-chev" />}
            </summary>
            {more && (
              <div className="mp-ai-agent-body">
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
    </Carousel>
    {data.buttonLabel && data.buttonHref && (
      <div className="ma-actions">
        <Button href={data.buttonHref} block>
          {data.buttonLabel}
        </Button>
      </div>
    )}
  </Section>
);

/** "How we build your AI": the run log, a tool call per step */
export const AiProcess: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-ai-log">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-ai-logn">{String(i + 1).padStart(2, "0")}</span>
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

/** "The technology behind our AI": model chips in a sideways row, two rows high */
export const AiTags: MobileSection<"tags"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ai-models" aria-label={oneLine(data.heading)}>
      {lines(data.items).map((t, i) => (
        <li key={i}>
          <span aria-hidden="true" />
          {t}
        </li>
      ))}
    </ul>
  </Section>
);

/** "AI for every industry": suggested prompts; open one to read the assistant's answer */
export const AiIndustries: MobileSection<"industries"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-ai-prompts">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <span>{x.name}</span>
            <IcChevron className="mp-ai-chev" />
          </summary>
          <Say>
            <p className="mp-ai-p">{x.description}</p>
          </Say>
        </details>
      ))}
    </div>
  </Section>
);

/** "AI that actually solves problems": a list of what stays on, like the memory / settings list of an assistant */
export const AiAdvantages: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-ai-why">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-ai-switch" aria-hidden="true" />
          <div>
            <b>{x.title}</b>
            <p>{x.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </Section>
);

/** FAQ: the question is your message, the answer opens as the assistant's reply */
export const AiFaq: MobileSection<"faq"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <div className="mp-ai-qa">
      {data.items.map((x, i) => (
        <details key={i}>
          <summary>
            <span>{x.question}</span>
          </summary>
          <Say>
            <p className="mp-ai-p">{x.answer}</p>
          </Say>
        </details>
      ))}
    </div>
  </Section>
);
