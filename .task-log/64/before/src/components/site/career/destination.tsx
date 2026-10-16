"use client";

import Link from "next/link";
import { useCareer } from "@/lib/career-store";
import type { JobView } from "@/lib/careers-shared";
import { GlowEdge } from "../glow-edge";
import { Reveal } from "../reveal";

// The last section of the Careers page: Surat Junction, where We3vision has its office. The station itself (the platform, the office building
// and the train that arrives) is drawn by the railway of the page (career/railway.tsx) in the empty place on the right. Nothing arrives here
// until a visitor has sent their ticket. At this station are also all the open jobs (written under Careers > Jobs in the admin panel): a card
// for each, with a button to read about the job and one to apply.

type Props = {
  chip: string;
  heading: string;
  text: string;
  station: string;
  address: string;
  buttonLabel: string;
  buttonHref: string;
  jobs: JobView[];
  jobsHeading: string;
  jobsText: string;
  jobsEmpty: string;
};

export function CareerDestination({ chip, heading, text, station, address, buttonLabel, buttonHref, jobs, jobsHeading, jobsText, jobsEmpty }: Props) {
  const career = useCareer();
  const arriving = career.stage === "arriving" || career.stage === "arrived";

  return (
    <section id="surat-junction" className="cj-dest">
      <div className="cj-dest-wrap">
        <div className="cj-dest-text">
          {chip && <span className="cj-chip">{chip}</span>}
          <h2>{heading.replace(/\n/g, " ")}</h2>
          {text && <p>{text}</p>}
          <div className="cj-station-card">
            <b>{station}</b>
            <p>{address}</p>
          </div>

          {jobsHeading && (
            <div id="openings" className="cj-jobs">
              <h3>{jobsHeading}</h3>
              {jobsText && <p className="cj-jobs-text">{jobsText}</p>}
              {jobs.length === 0 ? (
                <p className="ro-empty">{jobsEmpty}</p>
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
          )}

          {career.stage === "arrived" ? (
            <p className="cj-arrived">
              Welcome{career.name ? `, ${career.name.split(" ")[0]}` : ""}! Your seat{career.role ? ` for ${career.role}` : ""} is booked. Our HR team will write to you soon.
            </p>
          ) : arriving ? (
            <p className="cj-arrived">The train is coming in…</p>
          ) : null}
          {buttonLabel && buttonHref && (
            <a href={buttonHref} className="cj-dest-btn">
              {buttonLabel}
            </a>
          )}
        </div>
        <div className="cj-dest-slot" aria-hidden />
      </div>
    </section>
  );
}
