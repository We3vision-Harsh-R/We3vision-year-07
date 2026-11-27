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
export const CareersPass: MobileSection<"careerJourney"> = ({ index }) => {
  const H = index === 0 ? "h1" : "h2";
  const top = (
    <>
      <span className="mp-car-pass-k">Careers</span>
      <H className="mp-car-h">
        <Lines text={"Build your career\nwith We3vision"} />
      </H>
      <p className="mp-car-t">Tell us where you are, choose a position and talk to our HR team. It takes only two minutes.</p>
    </>
  );
  return (
    <>
      <section className="mp-car-top" aria-label="Careers at We3vision">
        {top}
        <div className="mp-car-cta">
          <a className="ma-btn ma-btn-fill" href="#mp-car-start">
            Start your application
          </a>
          <a className="ma-btn" href="#jobs">
            Open roles
          </a>
        </div>
      </section>
      <nav className="mp-car-jump" aria-label="Jump to a part of this page">
        {[
          ["Our team", "#careerTeams"],
          ["Open roles", "#jobs"],
          ["Apply", "#mp-car-start"],
          ["What we value", "#why-we3vision"],
          ["Contact HR", "#contact-hr"],
        ].map(([t, h]) => (
          <a key={h} href={h}>
            {t}
          </a>
        ))}
      </nav>
    </>
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
export const CareersTeams: MobileSection<"careerTeams"> = ({ data, id }) => {
  const [lead, ...rest] = data.heading.replace(/\n/g, " ").split(/,\s*/);
  const names = data.teams.map((t) => t.name);
  const half = Math.ceil(names.length / 2);
  const rows = [names.slice(0, half), names.slice(half)];
  return (
    <section id={id} className="ma-sec mp-car-gr-sec" aria-labelledby="mp-car-gr-t">
      <div className="mp-car-gr">
        <span className="mp-car-gr-k">About our team</span>
        <h2 id="mp-car-gr-t" className="mp-car-gr-h">
          {rest.length ? (
            <>
              {lead}, <em>{rest.join(", ")}</em>
            </>
          ) : (
            lead
          )}
        </h2>
        {data.intro && <p className="mp-car-gr-p">{data.intro}</p>}
        <a className="ma-btn ma-btn-fill mp-car-gr-b" href="#mp-car-start">
          Start your application
        </a>
        <div className="mp-car-gr-rows" aria-label="Our teams">
          {rows.map((r, ri) => (
            <ul key={ri} className="mp-car-gr-row" data-r={ri} aria-hidden={undefined}>
              {[...r, ...r, ...r].map((n, i) => (
                <li key={i} aria-hidden={i >= r.length ? true : undefined}>
                  <i aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
};

/** "Available roles": the open jobs (Admin > Careers), filtered by team; every job opens its sheet with Apply */
export const CareersDestination: MobileSection<"careerDestination"> = ({ data, extra }) => {
  const jobs = extra.jobs ?? [];
  return (
    <>
      {data.jobsHeading && (
        <Section id="jobs" chip="Available roles" title={data.jobsHeading} intro={data.jobsText}>
          {jobs.length === 0 ? (
            <p className="mp-car-empty">No position is open right now. You can still apply at the top of this page, and we will write to you when one opens.</p>
          ) : (
            <JobBoard
              allLabel="All"
              jobs={jobs.map((j) => {
                const meta = [j.location, j.workMode, j.workType, j.experience, j.training ? "Industry training available" : ""].filter(Boolean);
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
      <CareersBooking locationLabel="Your location" roles={jobs.map((j) => ({ id: j.id, title: j.title, team: j.team }))} questions={extra.career?.questions ?? []} schedule={extra.career?.schedule} />
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
