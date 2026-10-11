import { Globe } from "../globe";
import { ReachPlaces } from "../reach-places";
import { Reveal } from "../reveal";
import { SmartLink } from "../smart-link";
import { SplitHeading } from "../modern/split-heading";
import { Chip } from "../ui";
import type { SectionComponent } from "./shared";

/**
 * Global reach: no box, as wide as a laptop screen (it does not grow on a bigger monitor). On the left what we say (we work with clients in many countries), a clear button and the
 * names of the countries (the first place is the head office); on the right the globe with a line from the head office to every country.
 */
export const Reach: SectionComponent<"reach"> = ({ data, page }) => {
  const places = data.places
    .map((p) => ({ label: p.label, lat: Number(p.lat), lng: Number(p.lng) }))
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && Math.abs(p.lat) <= 90 && Math.abs(p.lng) <= 180);

  return (
    <section id="reach" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <div className="relative md:grid md:grid-cols-[1.05fr_1fr] md:items-center md:gap-10 lg:gap-16">
            {/* no box: the section is part of the page; a soft light behind the globe joins it to the background */}
            <div aria-hidden className="rp-glow" />
            <div className="relative z-10 md:max-w-[640px]">
              <Chip>{data.chip}</Chip>
              {page === "home" ? (
                <SplitHeading text={data.heading} className="mt-6 pb-1 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.6rem]" />
              ) : (
                <h2 className="text-vfade mt-6 whitespace-pre-line pb-1 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.6rem]">{data.heading}</h2>
              )}
              <p className="mt-6 max-w-xl text-lg leading-[1.7] text-orchid">{data.text}</p>
              {data.buttonLabel && (
                <div className="mt-9">
                  <SmartLink href={data.buttonHref || "#contact"} className="rp-cta">
                    <span>{data.buttonLabel}</span>
                    <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </SmartLink>
                </div>
              )}
              {places.length > 0 && (
                <div className="mt-10">
                  <p className="rp-label">{places.length > 2 ? "Countries we work with" : "Our offices"}</p>
                  <ReachPlaces labels={places.map((p) => p.label)} />
                </div>
              )}
            </div>
            <div className="relative z-10 mt-12 flex justify-center md:mt-0">
              <Globe places={places} label={`Globe showing ${places.map((p) => p.label).join(", ")}`} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
