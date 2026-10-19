import type { CSSProperties } from "react";
import type { SectionProps } from "../sections/shared";
import { HeroBadges } from "../hero-badges";
import { ButtonLink, Chip } from "../ui";
import { HeroGradient } from "./hero-gradient";

// First screen of the Animation page: the words on the left (same layout as the Web Development screen, .wdh-*), and on the right the classic animation
// test: a ball that bounces across a stage with squash and stretch, a shadow on the floor that grows and fades with the height, and three ghost frames
// (onion skin) that trail behind it. Pure CSS, theme colours (see .anm-* at the end of globals.css). With "reduce motion" the ball rests on the floor.
type Props = SectionProps<"pageHero">;

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });
const lag = (d: number) => ({ "--d": d }) as CSSProperties;

/** one ball: x moves it across, y bounces it, b squashes and stretches it (the ghosts are the same ball a little later in time) */
function Ball({ d }: { d: number }) {
  return (
    <span className={d === 0 ? "anm-x" : "anm-x anm-ghost"} style={lag(d)}>
      <span className="anm-y">
        <span className="anm-b" />
      </span>
    </span>
  );
}

export function AnimationHero({ data, site }: Pick<Props, "data" | "site">) {
  return (
    <section id="top" className="phz-hero wdh-root relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32">
      <HeroGradient page="animation" />
      <HeroBadges badges={site.badges} />
      <div className="wdh">
        <div className="wdh-copy">
          {data.chip && (
            <div className="animate-rise" style={rise(100)}>
              <Chip>{data.chip}</Chip>
            </div>
          )}
          <h1 className="wdh-h1 animate-rise" style={rise(250)}>
            {data.heading.replace(/\n/g, " ")}
          </h1>
          {data.text && (
            <p className="wdh-p animate-rise" style={rise(450)}>
              {data.text}
            </p>
          )}
          <div className="wdh-cta animate-rise" style={rise(650)}>
            <ButtonLink href={data.primaryHref}>{data.primaryLabel}</ButtonLink>
            <ButtonLink href={data.secondaryHref} variant="ghost">
              {data.secondaryLabel}
            </ButtonLink>
          </div>
        </div>

        <div className="anm" aria-hidden>
          <span className="anm-tag">Squash and stretch</span>
          <div className="anm-panel">
            <span className="anm-floor" />
            <span className="anm-x anm-sx" style={lag(0)}>
              <span className="anm-sh" />
            </span>
            <Ball d={3} />
            <Ball d={2} />
            <Ball d={1} />
            <Ball d={0} />
          </div>
        </div>
      </div>
    </section>
  );
}
