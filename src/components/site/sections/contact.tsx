import { GlowEdge } from "../glow-edge";
import { ContactFlow } from "../lazy";
import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;

/** One line of a contact card: emails and phone numbers become links automatically. */
function Line({ text }: { text: string }) {
  const value = text.trim();
  if (EMAIL.test(value)) return <a href={`mailto:${value}`} className="transition hover:text-violet">{value}</a>;
  if (PHONE.test(value)) return <a href={`tel:${value.replace(/[^\d+]/g, "")}`} className="transition hover:text-violet">{value}</a>;
  return <>{value}</>;
}

export const Contact: SectionComponent<"contact"> = ({ data, site }) => (
  <section id="contact" className="py-24 sm:py-32">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading} intro={data.text} />
    </Wide>
    {/* a short conversation (what, when, who) with a brief that fills in on the side; no box: it is part of the page. It is wider than the other
        blocks (up to the width of a laptop screen), so that it is not so high */}
    <div className="mx-auto mt-14 w-full max-w-[1280px] px-4 sm:px-8">
      <Reveal>
        <ContactFlow buttonLabel={data.buttonLabel} />
      </Reveal>
    </div>
    <Wide>
      {site.contactCards.length > 0 && (
        <div className="hm-addr mt-20 grid gap-5 md:grid-cols-3">
          {site.contactCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 90} className="h-full">
              <address className="bglow card-glass h-full rounded-[19px] border border-violet/[0.08] p-6 not-italic">
                <GlowEdge />
                <p className="text-vfade pb-1 text-xl font-semibold tracking-tight">{card.title}</p>
                <div className="mt-3 space-y-1.5 text-base leading-relaxed text-orchid">
                  {card.lines
                    .split("\n")
                    .filter((l) => l.trim())
                    .map((line, n) => (
                      <p key={n}>
                        <Line text={line} />
                      </p>
                    ))}
                </div>
              </address>
            </Reveal>
          ))}
        </div>
      )}
    </Wide>
  </section>
);
