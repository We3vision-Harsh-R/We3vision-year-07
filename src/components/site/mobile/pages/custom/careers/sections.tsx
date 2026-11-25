/* eslint-disable @next/next/no-img-element -- the small brand mark of the pass, like the kit pictures */
import type { CSSProperties } from "react";
import type { MobileSection } from "../../types";
import { AppLink, LeadForm, Section } from "../../../app";
import { SwipeDeck, TapSheet } from "../../../../lazy";
import { IcChevron } from "../../../app/icons";
import { Lines } from "../../../app/text";
import { JobBoard } from "./client";
import { CareersBooking } from "./booking";

// /careers like Apple's own apps (iOS 27): the top as a Wallet pass, the values as Tips cards that swipe, the teams as a Settings list whose rows
// open a sheet, the station as an Apple Maps card, the open jobs (Admin > Careers) filtered by team where every job opens its sheet with Apply,
// the help desk form as one grouped field. Same CMS words. Kit pieces: app/apple.tsx (ma-ap-); page styles: (m)/m/careers/page.css (mp-car-).


/** the top: a Wallet pass with the heading and the text, then "Your location" and the booking form (booking.tsx): the same booking as the laptop page, without the railway */
export const CareersPass: MobileSection<"careerJourney"> = ({ data, index, extra }) => {
  const H = index === 0 ? "h1" : "h2";
  const top = (
    <>
      <div className="mp-car-pass-top">
        {data.chip && <span className="mp-car-pass-k">{data.chip}</span>}
        <img className="mp-car-pass-logo" src="/brand/logo-mark.webp" alt="" width={480} height={395} />
      </div>
      <H className="mp-car-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-car-t">{data.text}</p>}
    </>
  );
  return <CareersBooking top={top} locationLabel={data.locationLabel || "Your location"} roles={extra.career?.roles ?? []} questions={extra.career?.questions ?? []} />;
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
  <Section id={id} chip="About our team" title={data.heading} intro={data.intro}>
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

/** "Available roles": the open jobs (Admin > Careers), filtered by team; every job opens its sheet with Apply */
export const CareersDestination: MobileSection<"careerDestination"> = ({ data, extra }) => {
  const jobs = extra.jobs ?? [];
  return (
    <>
      {data.jobsHeading && (
        <Section id="jobs" chip="Available roles" title={data.jobsHeading} intro={data.jobsText}>
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

const HR_EMAIL = "hr@we3vision.com";
const HR_PHONE = "+91 7383216096";

/** the help desk (the enquiry form), then Contact HR, the contact details and the footer of the page */
export const CareersHelpDesk: MobileSection<"careerHelpDesk"> = ({ data, site }) => (
  <>
    <Section id="contact" chip={data.chip} title={data.heading} intro={data.text}>
      <div className="mp-car-form">
        <LeadForm buttonLabel={data.buttonLabel || undefined} />
      </div>
    </Section>
    <Section id="contact-hr" chip="Contact HR" title="Talk to our HR team" intro="Write to us or call us. We read every message.">
      <div className="mp-car-hr">
        <a className="ma-btn ma-btn-fill ma-btn-block" href={`mailto:${HR_EMAIL}`}>
          Email HR
        </a>
        <a className="ma-btn ma-btn-block" href={`tel:${HR_PHONE.replace(/[^\d+]/g, "")}`}>
          Call HR
        </a>
      </div>
    </Section>
    <Section id="contact-details" chip="Contact details" title="Reach us">
      <ul className="mp-car-det">
        <li>
          <span>Email</span>
          <a href={`mailto:${HR_EMAIL}`}>{HR_EMAIL}</a>
        </li>
        <li>
          <span>Phone</span>
          <a href={`tel:${HR_PHONE.replace(/[^\d+]/g, "")}`}>{HR_PHONE}</a>
        </li>
      </ul>
    </Section>
    <footer className="mp-car-foot">
      <img className="mp-car-foot-logo" src="/brand/logo-mark.webp" alt="" width={480} height={395} />
      <p className="mp-car-foot-n">{site.legalName || site.name}</p>
      <nav aria-label="Footer">
        <ul>
          {[...site.nav.map((n) => ({ label: n.label, href: n.href })), { label: "Careers", href: "/careers" }, { label: "Contact", href: "/contact" }].map((l) => (
            <li key={l.label}>
              <AppLink href={l.href}>{l.label}</AppLink>
            </li>
          ))}
        </ul>
      </nav>
      {site.social.length > 0 && (
        <ul className="mp-car-foot-s">
          {site.social.map((l) => (
            <li key={l.label}>
              <AppLink href={l.href}>{l.label}</AppLink>
            </li>
          ))}
        </ul>
      )}
      <p className="mp-car-foot-c">{site.copyright}</p>
    </footer>
  </>
);
