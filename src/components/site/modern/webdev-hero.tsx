import type { CSSProperties } from "react";
import { HeroBadges } from "../hero-badges";
import type { SectionComponent } from "../sections/shared";
import { ButtonLink, Chip } from "../ui";
import { HeroGradient } from "./hero-gradient";

// First screen of the Web Development page: the words on the left, and on the right a browser window in which a website builds itself block by block
// (menu bar, hero, three cards, footer), then a selection outline walks over the blocks and names them. Pure CSS (no script), drawn in the theme
// colours (see .wdh-* at the end of globals.css). With "reduce motion" the finished page just stands there.
type Props = Parameters<SectionComponent<"pageHero">>[0];

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });
const at = (i: number) => ({ "--i": i }) as CSSProperties;

export function WebdevHero({ data, site }: Pick<Props, "data" | "site">) {
  return (
    <section id="top" className="phz-hero wdh-root relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32">
      <HeroGradient page="webdev" />
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

        <div className="wdh-win" aria-hidden>
          <div className="wdh-bar">
            <i />
            <i />
            <i />
            <span className="wdh-url" />
          </div>
          <div className="wdh-page">
            <div className="wdh-blk wdh-nav" data-tag="Menu" style={at(0)}>
              <span className="wdh-logo" />
              <span className="wdh-ln" />
              <span className="wdh-ln" />
              <span className="wdh-ln" />
              <span className="wdh-pill" />
            </div>
            <div className="wdh-blk wdh-top" data-tag="Hero" style={at(1)}>
              <div className="wdh-top-t">
                <span className="wdh-h" />
                <span className="wdh-h wdh-h2" />
                <span className="wdh-ln wdh-l3" />
                <span className="wdh-pill wdh-pill-b" />
              </div>
              <span className="wdh-img" />
            </div>
            <div className="wdh-cards">
              <div className="wdh-blk wdh-card" data-tag="Cards" style={at(2)}>
                <span className="wdh-ic" />
                <span className="wdh-ln" />
                <span className="wdh-ln wdh-l2" />
              </div>
              <div className="wdh-blk wdh-card" style={at(3)}>
                <span className="wdh-ic" />
                <span className="wdh-ln" />
                <span className="wdh-ln wdh-l2" />
              </div>
              <div className="wdh-blk wdh-card" style={at(4)}>
                <span className="wdh-ic" />
                <span className="wdh-ln" />
                <span className="wdh-ln wdh-l2" />
              </div>
            </div>
            <div className="wdh-blk wdh-foot" data-tag="Footer" style={at(5)}>
              <span className="wdh-ln" />
              <span className="wdh-ln" />
              <span className="wdh-ln" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
