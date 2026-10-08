import { GlowEdge } from "../glow-edge";
import { Globe } from "../globe";
import { Reveal } from "../reveal";
import { ButtonLink, Chip, Wide } from "../ui";
import type { SectionComponent } from "./shared";

export const Reach: SectionComponent<"reach"> = ({ data }) => {
  const places = data.places
    .map((p) => ({ label: p.label, lat: Number(p.lat), lng: Number(p.lng) }))
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && Math.abs(p.lat) <= 90 && Math.abs(p.lng) <= 180);

  return (
    <section id="reach" className="py-24 sm:py-32">
      <Wide>
        <Reveal>
          <div className="bglow card-glass relative overflow-hidden rounded-[19px] border border-violet/[0.08] p-8 sm:p-12 md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-8">
            <GlowEdge />
            <div className="relative z-10">
              <Chip>{data.chip}</Chip>
              <h2 className="text-vfade mt-6 whitespace-pre-line pb-1 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.6rem]">{data.heading}</h2>
              <p className="mt-5 max-w-md text-base leading-[1.7] text-orchid">{data.text}</p>
              <div className="mt-8">
                <ButtonLink href={data.buttonHref} variant="ghost">
                  {data.buttonLabel}
                </ButtonLink>
              </div>
              {places.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {places.map((p) => (
                    <li key={p.label} className="rounded-full border border-violet/15 bg-violet/[0.05] px-3.5 py-1.5 text-sm text-orchid">
                      {p.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-10 flex justify-center md:mt-0 md:translate-x-6">
              <Globe places={places} label={`Globe showing ${places.map((p) => p.label).join(" and ")}`} />
            </div>
          </div>
        </Reveal>
      </Wide>
    </section>
  );
};
