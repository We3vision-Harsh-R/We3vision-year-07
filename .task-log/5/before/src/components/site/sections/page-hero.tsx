import { Chip, ButtonLink } from "../ui";
import type { SectionComponent } from "./shared";

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

/** First screen of an inner page: small label, big heading, short text and two buttons, centred. */
export const PageHero: SectionComponent<"pageHero"> = ({ data }) => (
  <section id="top" className="relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32 text-center">
    {/* soft dark patch so the text stays readable over the bright 7s */}
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[min(1100px,100%)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,hsl(calc(var(--th)_+_344)_calc(71.43%_*_var(--ts))_4.12%_/_0.5),hsl(calc(var(--th)_+_344)_calc(71.43%_*_var(--ts))_4.12%_/_0.22)_65%,transparent)]" />
    <div className="relative mx-auto max-w-[900px]">
      {data.chip && (
        <div className="animate-rise" style={rise(100)}>
          <Chip>{data.chip}</Chip>
        </div>
      )}
      <h1
        className="animate-rise mt-7 whitespace-pre-line bg-gradient-to-b from-white to-[hsl(calc(var(--th)_+_352.8)_calc(100%_*_var(--ts))_85.29%)] bg-clip-text pb-2 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.04em] text-transparent drop-shadow-[0_6px_30px_hsl(calc(var(--th)_+_344)_calc(71.43%_*_var(--ts))_4.12%_/_0.85)] sm:text-6xl lg:text-[4.6rem]"
        style={rise(250)}
      >
        {data.heading}
      </h1>
      {data.text && (
        <p className="animate-rise mx-auto mt-6 max-w-[640px] text-base leading-relaxed text-white [text-shadow:0_2px_18px_hsl(calc(var(--th)_+_344)_calc(71.43%_*_var(--ts))_4.12%_/_0.95),0_0_6px_hsl(calc(var(--th)_+_344)_calc(71.43%_*_var(--ts))_4.12%_/_0.8)] sm:text-lg" style={rise(450)}>
          {data.text}
        </p>
      )}
      <div className="animate-rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5" style={rise(650)}>
        <ButtonLink href={data.primaryHref}>{data.primaryLabel}</ButtonLink>
        <ButtonLink href={data.secondaryHref} variant="ghost">
          {data.secondaryLabel}
        </ButtonLink>
      </div>
    </div>
  </section>
);
