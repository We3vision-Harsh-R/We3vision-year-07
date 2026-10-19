import type { SectionProps } from "../sections/shared";
import { HeroBadges } from "../hero-badges";
import { ButtonLink, Chip } from "../ui";
import { HeroGradient } from "./hero-gradient";

// First screen of the UI/UX Design page: the words on the left (same layout as the Web Development screen, .wdh-*), and on the right one screen drawn
// twice on top of each other: as a grey wireframe underneath and as the finished design above it. A light line sweeps across and paints the wireframe
// into the finished screen, holds, and sweeps back. Pure CSS, theme colours (see .uxh-* at the end of globals.css). With "reduce motion" the finished
// screen just stands there.
type Props = SectionProps<"pageHero">;

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

/** the one layout, drawn twice (the look of a block is decided by the layer it sits in) */
function Layout() {
  return (
    <div className="uxh-lay">
      <div className="uxh-nav">
        <span className="uxh-lg" />
        <span className="uxh-ln" />
        <span className="uxh-ln" />
        <span className="uxh-ln" />
        <span className="uxh-pill" />
      </div>
      <div className="uxh-top">
        <div className="uxh-top-t">
          <span className="uxh-h" />
          <span className="uxh-h uxh-h2" />
          <span className="uxh-ln uxh-l3" />
          <span className="uxh-ln uxh-l4" />
          <span className="uxh-pill uxh-pill-b" />
        </div>
        <span className="uxh-img" />
      </div>
      <div className="uxh-cards">
        {[0, 1, 2].map((k) => (
          <div key={k} className="uxh-card">
            <span className="uxh-ic" />
            <span className="uxh-ln" />
            <span className="uxh-ln uxh-l2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function UiuxHero({ data, site }: Pick<Props, "data" | "site">) {
  return (
    <section id="top" className="phz-hero wdh-root relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32">
      <HeroGradient page="ui-ux-design" />
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

        <div className="uxh" aria-hidden>
          <span className="uxh-tag uxh-tag1">Wireframe</span>
          <span className="uxh-tag uxh-tag2">UI design</span>
          <div className="uxh-frame">
            <div className="uxh-layer uxh-w">
              <Layout />
            </div>
            <div className="uxh-layer uxh-f">
              <Layout />
            </div>
            <span className="uxh-scan" />
          </div>
        </div>
      </div>
    </section>
  );
}
