import { RelatedLinks } from "../modern/related-links";
import { RelatedVariant } from "../modern/related-variants";
import { variantOf } from "../modern/variant-table";
import { ServiceStage } from "../modern/service-stage";
import { Reveal } from "../reveal";
import { ServiceStrip } from "../service-strip";
import { ButtonLink, SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

// "What we build": the body of the stage for the number of the table (modern/variant-table.ts); 7 is the strip of the classic pages
const BODY = ["stage", "canvas", "phone", "pipeline", "layers", "palette", "serp"] as const;

export const Services: SectionComponent<"services"> = ({ data, sectionId, skin, page }) => (
  skin === "modern" && sectionId === "related-services" ? (
    <section id="related-services" className="py-24 sm:py-32">
      <Wide>
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split />
        <div className="mt-14">
          {(() => {
            const v = variantOf(page, "related");
            return v !== null && v > 0 ? <RelatedVariant variant={v} cards={data.cards} /> : <RelatedLinks cards={data.cards} />;
          })()}
        </div>
      </Wide>
    </section>
  ) : skin === "modern" ? (
    <section id="services" className="py-24 sm:py-32">
      {/* the heading is part of the stage: it stays with it while the page scrolls through the boxes (see modern/service-stage.tsx) */}
      <ServiceStage
        cards={data.cards}
        variant={BODY[variantOf(page, "services") ?? 0] ?? "stage"}
        head={
          <Wide>
            <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} split>
              <ButtonLink href={data.buttonHref} variant="ghost">
                {data.buttonLabel}
              </ButtonLink>
            </SectionHead>
          </Wide>
        }
      />
    </section>
  ) : (
  <section id={sectionId === "related-services" ? sectionId : "services"} className="py-24 sm:py-32">
    {/* About, and every page whose cards carry the points (when it is right, problems, what you get): the heading is part of the pinned strip, so
        the chip and the heading stay on the screen below the logo while the panels open (see service-strip.tsx) */}
    {page === "about" || data.cards.some((c) => c.fit || c.problems || c.outcomes) ? (
      <Reveal>
        <ServiceStrip
          cards={data.cards}
          scroll={page === "about"}
          head={
            <div className="ss-head-in">
              {data.chip && <span className="ss-h-chip">{data.chip}</span>}
              {data.heading && <h2 className="text-vfade ss-h-h2">{data.heading.split("\n").join(" ")}</h2>}
              {data.intro && <p className="ss-h-p">{data.intro}</p>}
            </div>
          }
        />
      </Reveal>
    ) : (
      <>
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
      </>
    )}
  </section>
  )
);
