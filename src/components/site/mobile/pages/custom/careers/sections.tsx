/* eslint-disable @next/next/no-img-element -- the small brand mark of the pass, like the kit pictures */
import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, LeadForm, Section } from "../../../app";
import { SwipeDeck, TapSheet } from "../../../../lazy";
import { IcChevron, IcPin } from "../../../app/icons";
import { Lines, lines } from "../../../app/text";
import { JobBoard } from "./client";

// /careers like Apple's own apps (iOS 27): the top as a Wallet pass, the values as Tips cards that swipe, the teams as a Settings list whose rows
// open a sheet, the station as an Apple Maps card, the open jobs (Admin > Careers) filtered by team where every job opens its sheet with Apply,
// the help desk form as one grouped field. Same CMS words. Kit pieces: app/apple.tsx (ma-ap-); page styles: (m)/m/careers/page.css (mp-car-).

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?\d[\d\s().-]{6,}$/;

/** the top: a Wallet pass with the heading, the text and the "Your location" capsule that jumps to the help desk */
export const CareersPass: MobileSection<"careerJourney"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  return (
    <section className="mp-car-hero">
      <div className="mp-car-pass">
        <div className="mp-car-pass-top">
          {data.chip && <span className="mp-car-pass-k">{data.chip}</span>}
          <img className="mp-car-pass-logo" src="/brand/logo-mark.webp" alt="" width={480} height={395} />
        </div>
        <H className="mp-car-h">
          <Lines text={data.heading} />
        </H>
        <div className="mp-car-perf" aria-hidden="true" />
        {data.text && <p className="mp-car-t">{data.text}</p>}
        {data.locationLabel && (
          <a className="mp-car-loc" href="#contact">
            <IcPin className="mp-car-ic" />
            <span>{data.locationLabel}</span>
            <IcChevron className="mp-car-chev" />
          </a>
        )}
      </div>
    </section>
  );
};

/** "A Place To Grow": Tips cards that swipe sideways, with page dots */
export const CareersValues: MobileSection<"careerValues"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <SwipeDeck
      label={data.heading.replace(/\n/g, " ")}
      cards={data.items.map((x, i) => (
        <div key={i} style={{ "--k": i } as CSSProperties} className="mp-car-vcard">
          <span className="ma-ap-num">{String(i + 1).padStart(2, "0")}</span>
          <h3>{x.title}</h3>
          {x.description && <p>{x.description}</p>}
        </div>
      ))}
    />
  </Section>
);

/** "Seven Teams, One Company": a Settings list; a row opens the team's sheet and its service */
export const CareersTeams: MobileSection<"careerTeams"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="ma-ap-group">
      {data.teams.map((t, i) => (
        <li key={i} style={{ "--k": i } as CSSProperties}>
          <TapSheet
            triggerClass="ma-ap-row"
            label={t.name}
            title={t.name}
            trigger={
              <>
                <span className="ma-ap-ic" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="ma-ap-rt">
                  <b>{t.name}</b>
                  {t.text && <small>{t.text}</small>}
                </span>
                <IcChevron className="ma-ap-chev" />
              </>
            }
          >
            <div className="ma-ap-hd" style={{ "--k": i } as CSSProperties}>
              <span className="ma-ap-ic" aria-hidden="true">
                {i + 1}
              </span>
              <b>{t.name}</b>
            </div>
            {t.text && <p>{t.text}</p>}
            {t.href && (
              <AppLink href={t.href} className="ma-btn ma-btn-fill ma-btn-block">
                {t.name}
              </AppLink>
            )}
          </TapSheet>
        </li>
      ))}
    </ul>
  </Section>
);

/** "Welcome To Surat Junction" as an Apple Maps card + the open jobs: filter by team, every job opens its sheet with Apply */
export const CareersDestination: MobileSection<"careerDestination"> = ({ data, id, extra }) => {
  const jobs = extra.jobs ?? [];
  // the place for Apple Maps: the station and the lines of the address (not an e-mail or a phone number written under it)
  const where = [data.station, ...lines(data.address).filter((l) => !(l.includes("@") || PHONE.test(l)))].filter(Boolean).join(", ");
  return (
    <>
      <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
        {(data.station || data.address) && (
          <div className="mp-car-map">
            <div className="mp-car-map-art" aria-hidden="true">
              <i className="mp-car-road" />
              <i className="mp-car-road is-b" />
              <span className="mp-car-pin">
                <IcPin />
              </span>
            </div>
            <div className="mp-car-map-b">
              <div>
                {data.station && <p className="mp-car-sn">{data.station}</p>}
                {data.address && <p className="mp-car-sa">{data.address}</p>}
              </div>
              {where && (
                <a className="mp-car-dir" href={`https://maps.apple.com/?q=${encodeURIComponent(where)}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${where} in Maps`}>
                  <IcPin />
                </a>
              )}
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
              jobs={jobs.map((j) => {
                const meta = [j.location, j.workMode, j.workType, j.experience].filter(Boolean);
                return {
                  id: j.id,
                  team: j.team,
                  row: (
                    <TapSheet
                      triggerClass="mp-car-job"
                      label={j.title}
                      title={j.team || j.title}
                      trigger={
                        <>
                          <span className="mp-car-jb">
                            {j.team && <span className="mp-car-tag">{j.team}</span>}
                            <b>{j.title}</b>
                            {j.summary && <span className="mp-car-js">{j.summary}</span>}
                            <span className="mp-car-meta">{meta.join(" · ")}</span>
                          </span>
                          <IcChevron className="ma-ap-chev" />
                        </>
                      }
                    >
                      <div className="ma-ap-hd">
                        <span>
                          <b>{j.title}</b>
                          {j.team && <small>{j.team}</small>}
                        </span>
                      </div>
                      {j.summary && <p>{j.summary}</p>}
                      {meta.length > 0 && (
                        <ul className="ma-ap-fields">
                          {meta.map((m, n) => (
                            <li key={n}>
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <AppLink href={"/careers/" + j.slug} className="ma-btn ma-btn-fill ma-btn-block mp-car-applyb">
                        Apply
                      </AppLink>
                    </TapSheet>
                  ),
                };
              })}
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

/** the help desk: the enquiry form as one grouped field and the contact cards as open rows */
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
