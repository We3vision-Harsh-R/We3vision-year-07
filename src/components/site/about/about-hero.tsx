import { ButtonLink, Chip } from "../ui";

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

// The first screen of the About page: words only. Big heading, a few lines and two buttons, standing in a quiet room whose floor is a grid
// that comes towards you in perspective (a flat CSS plane, no 3D scene and nothing to load). It replaces the 3D island of the earlier page.
export function AboutHero({ chip, heading, text, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: { chip: string; heading: string; text: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string }) {
  return (
    <section id="top" className="ah">
      <div className="ah-floor" aria-hidden>
        <i className="ah-grid" />
        <i className="ah-horizon" />
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
        <div className="animate-rise ah-btns" style={rise(650)}>
          <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
          <ButtonLink href={secondaryHref} variant="ghost">
            {secondaryLabel}
          </ButtonLink>
        </div>
      </div>
      <a href="#story" className="ah-scroll" aria-label="Scroll to our story">
        <span />
      </a>
    </section>
  );
}
