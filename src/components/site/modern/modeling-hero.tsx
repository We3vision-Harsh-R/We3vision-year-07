import type { SectionProps } from "../sections/shared";
import { HeroBadges } from "../hero-badges";
import { ButtonLink, Chip } from "../ui";
import { HeroGradient } from "./hero-gradient";

// First screen of the 3D Modeling page: the words on the left (same layout as the Web Development screen, .wdh-*), and on the right a sphere that starts as a
// wireframe, fills with light and then changes its material: matte, glossy, metal, while a light circles it and its highlight moves. A tag names the
// state. Pure CSS (no script), theme colours (see .mdl-* at the end of globals.css). With "reduce motion" the glossy sphere stands still.
type Props = SectionProps<"pageHero">;

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });
const TAGS = ["Wireframe", "Matte", "Glossy", "Metal"];

export function ModelingHero({ data, site }: Pick<Props, "data" | "site">) {
  return (
    <section id="top" className="phz-hero wdh-root relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32">
      <HeroGradient page="3d-modeling" />
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

        <div className="mdl" aria-hidden>
          <div className="mdl-tags">
            {TAGS.map((t, i) => (
              <span key={t} className={`mdl-tag mdl-tag${i}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="mdl-panel">
            <span className="mdl-floor" />
            <div className="mdl-sphere">
              <span className="mdl-m mdl-matte" />
              <span className="mdl-m mdl-gloss" />
              <span className="mdl-m mdl-metal" />
              <div className="mdl-lt">
                <span className="mdl-glow" />
                <span className="mdl-spec" />
              </div>
              <svg className="mdl-wire" viewBox="0 0 250 250" fill="none">
                <circle cx="125" cy="125" r="124" />
                <ellipse cx="125" cy="125" rx="124" ry="30" />
                <ellipse cx="125" cy="63" rx="107" ry="26" />
                <ellipse cx="125" cy="187" rx="107" ry="26" />
                <ellipse cx="125" cy="18" rx="62" ry="15" />
                <ellipse cx="125" cy="232" rx="62" ry="15" />
                <ellipse cx="125" cy="125" rx="107" ry="124" />
                <ellipse cx="125" cy="125" rx="62" ry="124" />
                <path d="M125 1v248" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
