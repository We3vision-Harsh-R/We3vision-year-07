import type { CSSProperties } from "react";
import type { SectionProps } from "../sections/shared";
import { HeroBadges } from "../hero-badges";
import { ButtonLink, Chip } from "../ui";
import { HeroGradient } from "./hero-gradient";

// First screen of the CRM page: the words on the left (same layout as the Web Development screen, .wdh-*), and on the right one customer card in the
// middle with four tool tiles (email, WhatsApp, ERP, web form) round it. Every few seconds a pulse runs from a tile into the card and that line of the
// customer's history fills in: everything about one customer in one place. Pure CSS, theme colours (see .crh-* at the end of globals.css). With
// "reduce motion" the card stands there with its history already filled in.
type Props = SectionProps<"pageHero">;

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });
const at = (i: number) => ({ "--i": i }) as CSSProperties;

// the tiles and the way each one's line runs into the card (px inside the 540 x 420 stage)
const CHANNELS = [
  { name: "Email", cls: "crh-t1", path: "M170 52 C236 52 206 100 206 142" },
  { name: "WhatsApp", cls: "crh-t2", path: "M370 52 C304 52 334 100 334 142" },
  { name: "ERP", cls: "crh-t3", path: "M170 368 C236 368 206 320 206 278" },
  { name: "Web form", cls: "crh-t4", path: "M370 368 C304 368 334 320 334 278" },
] as const;

function Glyph({ k }: { k: number }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (k === 0) return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 8 8 6 8-6" /></svg>;
  if (k === 1) return <svg {...common}><path d="M5 18.5 6 15a8 8 0 1 1 3 3z" /><path d="M9.5 10.5c.4 2 2 3.4 4 4" /></svg>;
  if (k === 2) return <svg {...common}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><path d="M13 16.5h7M16.5 13v7" /></svg>;
  return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>;
}

export function CrmHero({ data, site }: Pick<Props, "data" | "site">) {
  return (
    <section id="top" className="phz-hero wdh-root relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32">
      <HeroGradient page="crm" />
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

        <div className="crh" aria-hidden>
          <svg className="crh-wires" viewBox="0 0 540 420" fill="none">
            {CHANNELS.map((c) => (
              <path key={c.name} d={c.path} />
            ))}
          </svg>
          {CHANNELS.map((c, i) => (
            <span key={c.name} className="crh-dot" style={{ offsetPath: `path("${c.path}")`, ...at(i) }} />
          ))}
          {CHANNELS.map((c, i) => (
            <div key={c.name} className={`crh-tile ${c.cls}`} style={at(i)}>
              <Glyph k={i} />
              <span>{c.name}</span>
            </div>
          ))}
          <div className="crh-card">
            <div className="crh-who">
              <span className="crh-av" />
              <span className="crh-nm">
                <i />
                <i />
              </span>
              <span className="crh-badge">One customer</span>
            </div>
            <ul className="crh-hist">
              {CHANNELS.map((c, i) => (
                <li key={c.name} style={at(i)}>
                  <span className="crh-ic" />
                  <span className="crh-bar" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
