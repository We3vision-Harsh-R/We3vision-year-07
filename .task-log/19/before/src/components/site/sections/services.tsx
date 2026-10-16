import { CircleGallery } from "../modern/circle-gallery";
import { RelatedLinks } from "../modern/related-links";
import { Reveal } from "../reveal";
import { ServiceStrip } from "../service-strip";
import { ButtonLink, SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

export const Services: SectionComponent<"services"> = ({ data, sectionId, skin }) => (
  skin === "modern" && sectionId === "related-services" ? (
    <section id="related-services" className="py-24 sm:py-32">
      <Wide>
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split />
        <div className="mt-14">
          <RelatedLinks cards={data.cards} />
        </div>
      </Wide>
    </section>
  ) : skin === "modern" ? (
    <section id="services" className="py-24 sm:py-32">
      <Wide>
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split>
          <ButtonLink href={data.buttonHref} variant="ghost">
            {data.buttonLabel}
          </ButtonLink>
        </SectionHead>
      </Wide>
      <div className="mx-auto mt-10 w-full max-w-[1180px] px-4">
        <CircleGallery cards={data.cards} />
      </div>
    </section>
  ) : (
  <section id={sectionId === "related-services" ? sectionId : "services"} className="py-24 sm:py-32">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro}>
        <ButtonLink href={data.buttonHref} variant="ghost">
          {data.buttonLabel}
        </ButtonLink>
      </SectionHead>
    </Wide>
    {/* all the cards in one line (a strip of panels on a desktop, a swipeable row on a phone) */}
    <Reveal>
      <ServiceStrip cards={data.cards} />
    </Reveal>
  </section>
  )
);
