import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, LeadForm, Section } from "../../../app";
import { IcChevron, IcPin } from "../../../app/icons";
import { Lines, lines } from "../../../app/text";
import { JobBoard } from "./client";

// /careers in iOS 27 style: open and quiet. A large title, values and teams as plain lists with hairlines, the jobs as a list you can filter
// by team (the only control on the page), the help desk form as one grouped field. Same CMS words and the real jobs (Admin > Careers).
// Styles: (m)/m/careers/page.css (prefix "mp-car-").

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;
const rv = (i: number) => ({ "--rv-d": `${Math.min(i, 6) * 60}ms` }) as CSSProperties;

/** the top: chip, large title, text and the "Your location" field of the laptop as a glass capsule that jumps to the help desk */
export const CareersPass: MobileSection<"careerJourney"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-car-hero">
      {data.chip && <span className="ma-chip">{data.chip}</span>}
      <H className="mp-car-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-car-t">{data.text}</p>}
      {data.locationLabel && (
        <a className="mp-car-loc" href="#contact">
          <IcPin className="mp-car-ic" />
          <span>{data.locationLabel}</span>
          <IcChevron className="mp-car-chev" />
        </a>
      )}
    </section>
  );
};

/** "A Place To Grow": the values as an open numbered list */
export const CareersValues: MobileSection<"careerValues"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="mp-car-vals">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i)}>
          <span className="mp-car-vn" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{x.title}</h3>
            {x.description && <p>{x.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  </Section>
);

/** "Seven Teams, One Company": a list of rows, each opens its service */
export const CareersTeams: MobileSection<"careerTeams"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-car-teams">
      {data.teams.map((t, i) => {
        const inner = (
          <>
            <span className="mp-car-pf" aria-hidden="true">
              {i + 1}
            </span>
            <span className="mp-car-tb">
              <b>{t.name}</b>
              {t.text && <span>{t.text}</span>}
            </span>
            {t.href && <IcChevron className="mp-car-chev" />}
          </>
        );
        return (
          <li key={i} className="ma-rvx" style={rv(i)}>
            {t.href ? <AppLink href={t.href} className="mp-car-team">{inner}</AppLink> : <div className="mp-car-team">{inner}</div>}
          </li>
        );
      })}
    </ul>
  </Section>
);

/** "Welcome To Surat Junction" (the station as plain text with a pin) + the open jobs, filterable by team */
export const CareersDestination: MobileSection<"careerDestination"> = ({ data, id, extra }) => {
  const jobs = extra.jobs ?? [];
  return (
    <>
      <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
        {(data.station || data.address) && (
          <div className="mp-car-station">
            <span className="mp-car-sp" aria-hidden="true">
              <IcPin />
            </span>
            <div>
              {data.station && <p className="mp-car-sn">{data.station}</p>}
              {data.address && <p className="mp-car-sa">{data.address}</p>}
            </div>
          </div>
        )}
      </Section>
      {data.jobsHeading && (
        <Section id="jobs" title={data.jobsHeading} intro={data.jobsText}>
          {jobs.length === 0 ? (
            <p className="mp-car-empty">{data.jobsEmpty}</p>
          ) : (
            <JobBoard
              allLabel="All"
              jobs={jobs.map((j) => ({
                id: j.id,
                team: j.team,
                row: (
                  <AppLink href={"/careers/" + j.slug} className="mp-car-job">
                    <span className="mp-car-jb">
                      {j.team && <span className="mp-car-tag">{j.team}</span>}
                      <b>{j.title}</b>
                      {j.summary && <span className="mp-car-js">{j.summary}</span>}
                      <span className="mp-car-meta">{[j.location, j.workMode, j.workType, j.experience].filter(Boolean).join(" · ")}</span>
                    </span>
                    <span className="mp-car-apply">Apply</span>
                  </AppLink>
                ),
              }))}
            />
          )}
          {data.buttonLabel && data.buttonHref && (
            <div className="ma-actions">
              <AppLink href={data.buttonHref} className="ma-btn ma-btn-fill ma-btn-block">
                {data.buttonLabel}
              </AppLink>
            </div>
          )}
        </Section>
      )}
    </>
  );
};

/** the help desk: the enquiry form as one grouped field (no extra box) and the contact cards as open rows */
export const CareersHelpDesk: MobileSection<"careerHelpDesk"> = ({ data, site }) => (
  <Section id="contact" chip={data.chip} title={data.heading} intro={data.text}>
    <div className="mp-car-form">
      <LeadForm buttonLabel={data.buttonLabel || undefined} />
    </div>
    {site.contactCards.map((card, i) => (
      <div key={i} className="mp-car-fields">
        {card.title && <p className="mp-car-fh">{card.title}</p>}
        <ul>
          {lines(card.lines).map((l, n) => {
            const href = EMAIL.test(l) ? "mailto:" + l : PHONE.test(l) ? "tel:" + l.replace(/[^\d+]/g, "") : undefined;
            return <li key={n}>{href ? <a href={href} className="mp-car-f is-link">{l}</a> : <span className="mp-car-f">{l}</span>}</li>;
          })}
        </ul>
      </div>
    ))}
  </Section>
);
