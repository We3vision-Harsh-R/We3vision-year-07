import { Reveal } from "../reveal";
import { ServiceStrip } from "../service-strip";
import { ButtonLink, SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

export const Services: SectionComponent<"services"> = ({ data, sectionId }) => (
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
);
