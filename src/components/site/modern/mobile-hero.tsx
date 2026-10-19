import type { SectionProps } from "../sections/shared";
import { HeroBadges } from "../hero-badges";
import { ButtonLink, Chip } from "../ui";
import { HeroGradient } from "./hero-gradient";

// First screen of the Mobile App Development page: the words on the left (same layout as the Web Development screen, .wdh-*), and on the right one
// code card that splits into two phones, an iPhone-style one and an Android-style one, which show the same screens and swipe together.
// Pure CSS, drawn in the theme colours (see .mbh-* at the end of globals.css). With "reduce motion" the phones stand still on their first screen.
type Props = SectionProps<"pageHero">;

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

/** the three screens of the app (the first is repeated at the end so the swipe loops without a jump) */
function Screens() {
  return (
    <div className="mbh-track">
      {[0, 1, 2, 0].map((k, i) => (
        <div key={i} className="mbh-pn">
          {k === 0 && (
            <>
              <span className="mbh-hd" />
              <span className="mbh-img" />
              <span className="mbh-row" />
              <span className="mbh-row mbh-r2" />
            </>
          )}
          {k === 1 && (
            <>
              <span className="mbh-hd" />
              <span className="mbh-feed">
                <i />
                <b />
              </span>
              <span className="mbh-feed">
                <i />
                <b />
              </span>
              <span className="mbh-feed">
                <i />
                <b />
              </span>
            </>
          )}
          {k === 2 && (
            <>
              <span className="mbh-hd" />
              <span className="mbh-ok" />
              <span className="mbh-row mbh-r3" />
              <span className="mbh-btn" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function MobileHero({ data, site }: Pick<Props, "data" | "site">) {
  return (
    <section id="top" className="phz-hero wdh-root relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32">
      <HeroGradient page="mobile" />
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

        <div className="mbh" aria-hidden>
          <div className="mbh-code">
            <span className="mbh-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="mbh-tag">One codebase</span>
            <span className="mbh-cl" />
            <span className="mbh-cl mbh-c2" />
            <span className="mbh-cl mbh-c3" />
          </div>
          <svg className="mbh-wires" viewBox="0 0 540 420" fill="none">
            <path d="M270 92 C270 126 160 118 160 150" />
            <path d="M270 92 C270 126 380 118 380 150" />
          </svg>
          <div className="mbh-ph mbh-ios">
            <span className="mbh-isl" />
            <div className="mbh-scr">
              <Screens />
            </div>
            <span className="mbh-home" />
          </div>
          <div className="mbh-ph mbh-and">
            <span className="mbh-hole" />
            <div className="mbh-scr">
              <Screens />
            </div>
            <span className="mbh-nav">
              <i />
              <i />
              <i />
            </span>
          </div>
          <span className="mbh-lab mbh-l1">iPhone</span>
          <span className="mbh-lab mbh-l2">Android</span>
        </div>
      </div>
    </section>
  );
}
