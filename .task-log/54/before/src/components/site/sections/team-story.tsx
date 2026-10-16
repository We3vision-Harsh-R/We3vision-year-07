import { GlowEdge } from "../glow-edge";
import { Reveal } from "../reveal";
import { SectionHead, Chip, Rich } from "../ui";
import { SplitHeading } from "../modern/split-heading";
import type { SectionComponent } from "./shared";

// The reading sections of the Team page (see the .tm-*, .tj-* and .tv-* rules in globals.css):
//  - TeamManifesto: why the people matter. A heading that stays in place on the left, the text on the right, a quotation at the end.
//  - TeamJourney:   how a project passes from hand to hand: numbered steps on a line, each with the people who do it.
//  - TeamValues:    what the team believes in: numbered statements next to a heading that stays in place.
// All of it is plain text in the page. Nothing is hidden when JavaScript does not run.

const two = (n: number) => String(n).padStart(2, "0");

export const TeamManifesto: SectionComponent<"teamManifesto"> = ({ data }) => {
  const paragraphs = data.body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
  return (
    <section id="why" className="tm py-24 sm:py-32">
      <div className="tm-grid mx-auto w-full max-w-[1120px] px-4">
        <div className="tm-head">
          {data.chip && <Chip>{data.chip}</Chip>}
          <SplitHeading text={data.heading} className="tm-h2 mt-6 pb-1 font-semibold tracking-[-0.04em]" />
        </div>
        <Reveal delay={80} className="tm-body">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "tm-lead" : undefined}>
              <Rich text={p} />
            </p>
          ))}
          {data.quote && (
            <figure className="tm-quote">
              <blockquote>{data.quote}</blockquote>
              {data.quoteBy && <figcaption>{data.quoteBy}</figcaption>}
            </figure>
          )}
        </Reveal>
      </div>
    </section>
  );
};

export const TeamJourney: SectionComponent<"teamJourney"> = ({ data }) => (
  <section id="journey" className="tm py-24 sm:py-32">
    <div className="mx-auto w-full max-w-[1120px] px-4">
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split />
      <ol className="tj mt-16">
        {data.steps.map((s, i) => (
          <li key={i} className="tj-item">
            <div className="tj-step bglow">
              <GlowEdge />
              <span className="tj-no" aria-hidden>
                {two(i + 1)}
              </span>
              <h3>{s.stage}</h3>
              {s.who && <p className="tj-who">{s.who}</p>}
              <p className="tj-text">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export const TeamValues: SectionComponent<"teamValues"> = ({ data }) => (
  <section id="values" className="tm py-24 sm:py-32">
    <div className="tm-grid mx-auto w-full max-w-[1120px] px-4">
      <div className="tm-head">
        {data.chip && <Chip>{data.chip}</Chip>}
        <SplitHeading text={data.heading} className="tm-h2 mt-6 pb-1 font-semibold tracking-[-0.04em]" />
        {data.intro && <p className="tm-intro">{data.intro}</p>}
      </div>
      <ol className="tv">
        {data.items.map((it, i) => (
          <li key={i} className="tv-row">
            <span className="tv-no" aria-hidden>
              {two(i + 1)}
            </span>
            <div>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
