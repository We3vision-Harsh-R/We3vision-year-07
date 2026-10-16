import type { MobileSection } from "../../types";
import { AppLink, Section } from "../../../app";
import { IcChevron } from "../../../app/icons";
import { Lines } from "../../../app/text";

// /careers as a "Wallet" app: the career journey of the laptop (a train ticket) becomes a boarding pass, the open jobs a departures board
// with an Apply button per job, values and teams as cards. Same CMS words and the real jobs (Admin > Careers). Styles: (m)/m/careers/page.css.

/** the top: a ticket with the heading, the text and the "Your location" field of the laptop */
export const CareersPass: MobileSection<"careerJourney"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-car-pass">
      <div className="mp-car-pass-top">
        <span className="ma-chip">{data.chip}</span>
        <H className="mp-car-h">
          <Lines text={data.heading} />
        </H>
        {data.text && <p className="mp-car-t">{data.text}</p>}
      </div>
      {data.locationLabel && (
        <>
          <div className="mp-car-perf" aria-hidden="true" />
          <a className="mp-car-pass-bot" href="#contact">
            <span className="mp-car-field">{data.locationLabel}</span>
            <IcChevron className="mp-car-chev" />
          </a>
        </>
      )}
    </section>
  );
};

/** "A Place To Grow": the values as a sideways row of cards */
export const CareersValues: MobileSection<"careerValues"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="mp-car-vals">
      {data.items.map((x, i) => (
        <li key={i}>
          <span className="mp-car-vn">{String(i + 1).padStart(2, "0")}</span>
          <h3>{x.title}</h3>
          <p>{x.description}</p>
        </li>
      ))}
    </ul>
  </Section>
);

/** "Seven Teams, One Company": platforms of the station, each opens its service */
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
        return <li key={i}>{t.href ? <AppLink href={t.href} className="mp-car-team">{inner}</AppLink> : <div className="mp-car-team">{inner}</div>}</li>;
      })}
    </ul>
  </Section>
);

/** "Welcome To Surat Junction" + the open jobs as a departures board with Apply */
export const CareersDestination: MobileSection<"careerDestination"> = ({ data, id, extra }) => {
  const jobs = extra.jobs ?? [];
  return (
    <>
      <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
        {(data.station || data.address) && (
          <div className="mp-car-station">
            {data.station && <p className="mp-car-sn">{data.station}</p>}
            {data.address && <p>{data.address}</p>}
          </div>
        )}
      </Section>
      {data.jobsHeading && (
        <Section id="jobs" title={data.jobsHeading} intro={data.jobsText}>
          {jobs.length === 0 ? (
            <p className="mp-car-empty">{data.jobsEmpty}</p>
          ) : (
            <ul className="mp-car-board">
              {jobs.map((j) => (
                <li key={j.id} className="mp-car-job">
                  <div className="mp-car-jh">
                    <h3>{j.title}</h3>
                    {j.team && <span className="mp-car-tag">{j.team}</span>}
                  </div>
                  {j.summary && <p>{j.summary}</p>}
                  <ul className="mp-car-meta">
                    {[j.location, j.workMode, j.workType, j.experience].filter(Boolean).map((m, n) => (
                      <li key={n}>{m}</li>
                    ))}
                  </ul>
                  <AppLink href={"/careers/" + j.slug} className="ma-btn ma-btn-tinted ma-btn-block">
                    Apply
                  </AppLink>
                </li>
              ))}
            </ul>
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
