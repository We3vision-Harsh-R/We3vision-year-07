import { Fragment } from "react";
import { LiveClock, RotatingWord } from "../rotating-word";
import { SmartLink } from "../smart-link";
import { ButtonLink } from "../ui";
import type { SectionComponent } from "./shared";

const SHORT: Record<string, string> = { linkedin: "LI", instagram: "IG", dribbble: "DR", behance: "BE", twitter: "X", x: "X", facebook: "FB", youtube: "YT" };
const short = (label: string) => SHORT[label.toLowerCase()] ?? label.slice(0, 2).toUpperCase();

/** First screen with a giant word that swipes through languages, a tagline, two buttons, a live clock and social links. */
export const WordHero: SectionComponent<"wordHero"> = ({ data, site }) => (
  <section id="top" className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-32 pt-28 text-center">
    <RotatingWord words={data.words} />
    <h1 className="mt-6 max-w-[780px] text-[clamp(1.2rem,2vw,1.75rem)] font-medium leading-snug tracking-[-0.01em] text-white">{data.heading}</h1>
    {data.text && <p className="mx-auto mt-4 max-w-[560px] text-base leading-relaxed text-orchid">{data.text}</p>}
    <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
      <ButtonLink href={data.primaryHref}>{data.primaryLabel}</ButtonLink>
      <ButtonLink href={data.secondaryHref} variant="ghost">
        {data.secondaryLabel}
      </ButtonLink>
    </div>
    <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 lg:block">
      <LiveClock timezone={data.timezone} label={data.clockLabel} />
    </div>
    {site.social.length > 0 && (
      <nav aria-label="Social links" className="absolute bottom-32 right-8 hidden items-center gap-2 text-sm tracking-[0.12em] text-orchid lg:flex">
        {site.social.map((s, i) => (
          <Fragment key={s.href}>
            {i > 0 && <span aria-hidden>/</span>}
            <SmartLink href={s.href} aria-label={s.label} className="transition-colors hover:text-white">
              {short(s.label)}
            </SmartLink>
          </Fragment>
        ))}
      </nav>
    )}
  </section>
);
