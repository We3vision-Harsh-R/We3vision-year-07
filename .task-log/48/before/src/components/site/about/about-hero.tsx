import { Chip } from "../ui";

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

// The first screen of the About page: words only. A small label, the big heading and a few lines, on a quiet background of soft coloured light that
// drifts very slowly (three round gradients that only move, nothing to load). No buttons and no pictures: the words are all there is.
export function AboutHero({ chip, heading, text }: { chip: string; heading: string; text: string; primaryLabel?: string; primaryHref?: string; secondaryLabel?: string; secondaryHref?: string }) {
  return (
    <section id="top" className="ah">
      <div className="ah-bg" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <div className="ah-in">
        {chip && (
          <div className="animate-rise" style={rise(100)}>
            <Chip>{chip}</Chip>
          </div>
        )}
        <h1 className="animate-rise ah-h1" style={rise(250)}>
          {heading}
        </h1>
        {text && (
          <p className="animate-rise ah-p" style={rise(450)}>
            {text}
          </p>
        )}
      </div>
    </section>
  );
}
