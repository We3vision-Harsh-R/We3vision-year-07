import Link from "next/link";
import { getCareerSetup, getOpenJobs } from "@/lib/careers";
import { GlowEdge } from "../glow-edge";
import { ContactFlow } from "../contact-flow";
import { CareerRailway } from "../career/railway";
import { CareerDestination } from "../career/destination";
import { CareerJourney } from "../career/journey";
import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

const two = (n: number) => String(n).padStart(2, "0");

/** The ticket office of the Careers page and the railway that runs through the whole page (see career/journey.tsx and career/railway.tsx). */
export const CareerJourneySection: SectionComponent<"careerJourney"> = async ({ data }) => {
  const { roles, questions } = await getCareerSetup();
  return (
    <>
      <CareerRailway />
      <CareerJourney chip={data.chip} heading={data.heading} text={data.text} locationLabel={data.locationLabel || "Your location"} roles={roles} questions={questions} />
    </>
  );
};

/** Surat Junction: the last section, where the train of the visitor arrives (see career/destination.tsx). */
export const CareerDestinationSection: SectionComponent<"careerDestination"> = ({ data }) => (
  <CareerDestination chip={data.chip} heading={data.heading} text={data.text} station={data.station || "Surat Junction"} address={data.address} buttonLabel={data.buttonLabel} buttonHref={data.buttonHref} />
);

/** The open jobs: a card for each, with a button to read about the job and one to apply (the page of the job has the apply form). */
export const CareerOpeningsSection: SectionComponent<"careerOpenings"> = async ({ data }) => {
  const jobs = await getOpenJobs();
  return (
    <section id="openings" className="ro">
      <div className="ro-in">
        <div className="ro-head">
          {data.chip && <span className="cj-chip">{data.chip}</span>}
          <h2>{data.heading.replace(/\n/g, " ")}</h2>
          {data.text && <p>{data.text}</p>}
        </div>
        {jobs.length === 0 ? (
          <p className="ro-empty">{data.emptyText}</p>
        ) : (
          <ul className="ro-list">
            {jobs.map((j, i) => (
              <li key={j.id}>
                <Reveal className="ro-card bglow" delay={(i % 2) * 80}>
                  <GlowEdge />
                  <div className="ro-top">
                    <span className="ro-team">{j.team || "All teams"}</span>
                    <span className="ro-posted">{j.postedLabel}</span>
                  </div>
                  <h3>
                    <Link href={`/careers/${j.slug}`}>{j.title}</Link>
                  </h3>
                  {j.summary && <p className="ro-sum">{j.summary}</p>}
                  <ul className="ro-facts">
                    {[j.workType, j.workMode, j.location, j.experience].filter(Boolean).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="ro-act">
                    <Link href={`/careers/${j.slug}`} className="ro-view">
                      View details
                    </Link>
                    <Link href={`/careers/${j.slug}#apply`} className="ro-apply">
                      Apply now
                    </Link>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

/** The values of the company as the stops of the line: every item has a marker, the railway draws a little station beside the track there. */
export const CareerValuesSection: SectionComponent<"careerValues"> = ({ data }) => (
  <section id="advantages" className="rv">
    <div className="rv-in">
      <div className="rv-head">
        {data.chip && <span className="cj-chip">{data.chip}</span>}
        <h2>{data.heading.replace(/\n/g, " ")}</h2>
        {data.intro && <p>{data.intro}</p>}
      </div>
      <ol className="rv-list">
        {data.items.map((it, i) => (
          <li key={i} className="rv-stop">
            <i className="rv-mark" data-stop={it.title} aria-hidden />
            <Reveal className="rv-card bglow">
              <GlowEdge />
              <span className="rv-no">Stop {two(i + 1)}</span>
              <h3>{it.title}</h3>
              <p>{it.description}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/** The teams as the lines of a departure board. */
export const CareerTeamsSection: SectionComponent<"careerTeams"> = ({ data }) => (
  <section id="services" className="rt">
    <div className="rt-in">
      <div className="rv-head" data-right>
        {data.chip && <span className="cj-chip">{data.chip}</span>}
        <h2>{data.heading.replace(/\n/g, " ")}</h2>
        {data.intro && <p>{data.intro}</p>}
      </div>
      <div className="rt-board" role="table" aria-label="Teams">
        <div className="rt-board-top">
          <span>Departures</span>
          <span>We3vision Railways</span>
        </div>
        {data.teams.map((t, i) => {
          const Row = t.href ? "a" : "div";
          return (
            <Row key={i} className="rt-row" {...(t.href ? { href: t.href } : {})} role="row">
              <i className="rv-mark" data-stop={t.name} aria-hidden />
              <span className="rt-time">{String(8 + Math.floor(i * 1.5)).padStart(2, "0")}:{i % 2 ? "30" : "00"}</span>
              <span className="rt-name">
                <b>{t.name}</b>
                <i>{t.text}</i>
              </span>
              <span className="rt-plat">Platform {i + 1}</span>
              <span className="rt-state" data-i={i % 3}>
                {i % 3 === 0 ? "Boarding" : i % 3 === 1 ? "On time" : "Open seats"}
              </span>
            </Row>
          );
        })}
      </div>
    </div>
  </section>
);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;
function Line({ text }: { text: string }) {
  const value = text.trim();
  if (EMAIL.test(value)) return <a href={`mailto:${value}`} className="transition hover:text-violet">{value}</a>;
  if (PHONE.test(value)) return <a href={`tel:${value.replace(/[^\d+]/g, "")}`} className="transition hover:text-violet">{value}</a>;
  return <>{value}</>;
}

/** The help desk: the contact conversation, in an enquiry office of the railway. */
export const CareerHelpDeskSection: SectionComponent<"careerHelpDesk"> = ({ data, site }) => (
  <section id="contact" className="rh">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading} intro={data.text} />
    </Wide>
    <div className="rh-window mx-auto mt-14 w-full max-w-[1280px] px-4 sm:px-8">
      <div className="rh-sign">
        <span>Enquiries</span>
        <i aria-hidden />
        <span>Help desk</span>
      </div>
      <Reveal>
        <ContactFlow buttonLabel={data.buttonLabel} />
      </Reveal>
    </div>
    <Wide>
      {site.contactCards.length > 0 && (
        <div className="mt-16 grid gap-5 md:grid-cols-3">
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
