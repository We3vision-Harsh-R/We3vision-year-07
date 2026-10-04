import { ContactForm } from "../contact-form";
import { Reveal } from "../reveal";
import { Frame, SectionHead, Wide } from "../ui";
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
      <Reveal className="mt-12">
        <Frame width="max-w-[560px]" className="px-0">
          <div className="px-4 py-10 sm:px-8">
            <ContactForm buttonLabel={data.buttonLabel} />
          </div>
        </Frame>
      </Reveal>

      {site.contactCards.length > 0 && (
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {site.contactCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 90} className="h-full">
              <address className="card-glass h-full rounded-[19px] border border-violet/[0.08] p-6 not-italic">
                <p className="text-vfade pb-1 text-xl font-semibold tracking-tight">{card.title}</p>
                <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-orchid">
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
