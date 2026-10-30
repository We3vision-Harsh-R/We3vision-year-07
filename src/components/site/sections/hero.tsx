import type { SectionData } from "@/lib/cms/sections";
import { HeroBadges } from "../hero-badges";
import { HomeIntro } from "../home-intro";
import { HeroScene } from "../lazy";
import { ServicesRail } from "../services-rail";
import { ServicesStage } from "../services-stage";
import type { SectionProps } from "./shared";

// The hero of the home page. Since 2026-10-24 (owner) the laptop / desktop home starts with one calm first screen (home-intro.tsx): big type,
// the anniversary seal, the Startup India + MSME logos and the facts of "At a glance" (handed over by PageSections as `glance`). Under it come the
// services of hero-scene.tsx (boxes, walking guide, split board) in "servicesOnly" mode: the particle ball is gone. Other pages with a hero
// section keep the full old scene.
export function Hero({ data, site, page, glance }: SectionProps<"hero"> & { glance?: SectionData<"highlights"> }) {
  if (page === "home") {
    return (
      <>
        <HomeIntro
          title={data.title}
          above={data.above}
          mark={data.mark}
          below={data.below}
          chip={glance?.chip ?? ""}
          facts={glance?.items ?? []}
          badges={site.badges}
          services={data.cards.map((c) => c.title.replace(/\s+/g, " ").trim()).filter(Boolean)}
        />
        {/* the services (owner, 2026-10-24: "service nu section pachu lav"): the same boxes, guide and split board, without the particle ball.
            Phone and tablet (below 1024px, owner 2026-10-29) get a row of cards to swipe instead; styles/home-mobile.css shows one of the two.
            The wrapper is the anchor "#services" for both. */}
        <div id="services" className="hm-svc">
          <ServicesRail cards={data.cards} />
          <div className="hm-desk">
            <ServicesStage cards={data.cards} />
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="relative">
      <h1 className="sr-only">{data.title}</h1>
      <p className="sr-only">{[data.above, data.mark, data.below].filter(Boolean).join(" ")}</p>
      <HeroScene mark={data.mark} above={data.above} below={data.below} cards={data.cards} />
      <HeroBadges badges={site.badges} />
    </div>
  );
}
