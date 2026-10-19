import { ContactReception } from "../lazy";
import { HeroBadges } from "../hero-badges";
import { AiHeroBg } from "../modern/ai-hero-bg";
import CursorGrid from "../modern/cursor-grid";
import { HeroGradient } from "../modern/hero-gradient";
import { AnimationHero } from "../modern/animation-hero";
import { CrmHero } from "../modern/crm-hero";
import { MobileHero } from "../modern/mobile-hero";
import { UiuxHero } from "../modern/uiux-hero";
import { WebdevHero } from "../modern/webdev-hero";
import { Chip, ButtonLink } from "../ui";
import type { SectionComponent } from "./shared";

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

/** First screen of an inner page: small label, big heading, short text and two buttons, centred. */
export const PageHero: SectionComponent<"pageHero"> = ({ data, skin, site, page }) => {
  // the contact page: a receptionist at the reception desk who asks what the visitor would like to know
  if (page === "contact") {
    const links = [
      { label: data.primaryLabel, href: data.primaryHref },
      { label: data.secondaryLabel, href: data.secondaryHref },
    ].filter((l) => l.label && l.href);
    return <ContactReception chip={data.chip} heading={data.heading} text={data.text} links={links} badges={<HeroBadges badges={site.badges} />} />;
  }
  // the Web Development page has its own first screen: a website that builds itself in a browser window
  if (page === "webdev") return <WebdevHero data={data} site={site} />;
  // the Mobile App page: one code card that splits into an iPhone-style and an Android-style phone
  if (page === "mobile") return <MobileHero data={data} site={site} />;
  // the CRM page: one customer card with the tools of the company round it
  if (page === "crm") return <CrmHero data={data} site={site} />;
  // the UI/UX page: a wireframe that a light line paints into the finished screen
  if (page === "ui-ux-design") return <UiuxHero data={data} site={site} />;
  // the Animation page: the classic bouncing-ball test
  if (page === "animation") return <AnimationHero data={data} site={site} />;
  return (
  <section id="top" className="phz-hero relative flex min-h-screen items-center justify-center px-4 pb-32 pt-32 text-center">
    {/* the service pages: soft light in the colours of the theme behind the words, a different pattern on every page */}
    {skin === "modern" && page !== "ai" && page !== "blog" && page !== "team" && <HeroGradient page={page ?? ""} />}
    {/* the AI page: a smooth gradient with a quiet neural network */}
    {page === "ai" && <AiHeroBg />}
    {/* the team page: the same background as the About page, three soft lights of colour that drift very slowly */}
    {page === "team" && (
      <div className="ah-bg" aria-hidden>
        <i />
        <i />
        <i />
      </div>
    )}
    {/* the blog: a grid of cells that light up round the pointer (React Bits CursorGrid); it listens to the whole first screen */}
    {page === "blog" && (
      <div className="cg-hero" aria-hidden>
        <CursorGrid follow cellSize={45} radius={110} falloff="smooth" holdTime={300} fadeDuration={500} lineWidth={1.5} maxOpacity={0.6} fillOpacity={0.02} gridOpacity={0} cellRadius={10} clickPulse pulseSpeed={600} />
      </div>
    )}
    {/* soft dark patch so the text stays readable over the bright 7s */}
    {page !== "team" && <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[min(1100px,100%)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,hsl(calc(var(--th)_+_344)_calc(71.43%_*_var(--ts))_4.12%_/_0.5),hsl(calc(var(--th)_+_344)_calc(71.43%_*_var(--ts))_4.12%_/_0.22)_65%,transparent)]" />}
    <HeroBadges badges={site.badges} />
    <div className="relative mx-auto max-w-[900px]">
      {data.chip && (
        <div className="animate-rise" style={rise(100)}>
          <Chip>{data.chip}</Chip>
        </div>
      )}
      <h1
        className="phz-h1 animate-rise mt-7 whitespace-pre-line bg-gradient-to-b from-white to-[hsl(calc(var(--th)_+_352.8)_calc(100%_*_var(--ts))_85.29%)] bg-clip-text pb-2 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.04em] text-transparent drop-shadow-[0_6px_30px_hsl(calc(var(--th)_+_344)_calc(71.43%_*_var(--ts))_4.12%_/_0.85)] sm:text-6xl lg:text-[4.6rem]"
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
};
