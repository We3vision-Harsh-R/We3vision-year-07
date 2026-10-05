import { IconTile } from "../icons";
import { Reveal } from "../reveal";
import { SmartLink } from "../smart-link";
import { ButtonLink, SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

export const Services: SectionComponent<"services"> = ({ data }) => (
  <section id="services" className="py-24 sm:py-32">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro}>
        <ButtonLink href={data.buttonHref} variant="ghost">
          {data.buttonLabel}
        </ButtonLink>
      </SectionHead>
      {/* 4 cards sit best as 2 x 2 (3 columns would leave one card alone on the second row) */}
      <div className={`mt-16 grid gap-5 sm:grid-cols-2 ${data.cards.length === 4 ? "" : "lg:grid-cols-3"}`}>
        {data.cards.map((card, i) => (
          <Reveal key={i} delay={(i % 3) * 90} className="h-full">
            <article className="card-glass group flex h-full flex-col items-center rounded-[19px] border border-violet/[0.08] p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-violet/30 hover:shadow-[0_20px_50px_rgba(120,40,180,0.25)]">
              <IconTile index={i} />
              <h3 className="text-vfade mt-6 whitespace-pre-line pb-1 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em]">{card.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-orchid">{card.description}</p>
              {card.href && (
                <SmartLink href={card.href} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-violet/80 transition hover:text-violet">
                  Learn more
                  <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current transition-transform group-hover:translate-x-1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </SmartLink>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Wide>
  </section>
);
