"use client";

import "@/styles/careers.css";

import Link from "next/link";
import { useCareer } from "@/lib/career-store";
import type { JobView } from "@/lib/careers-shared";

// The last section of the Careers page: Surat Junction, where We3vision has its office. On the right is the station, drawn by the railway of the
// page (career/railway.tsx): the office stands in one line with the heading, the platform is under it and the train arrives there. Nothing
// arrives until a visitor has sent their ticket. In the left column, under the heading and the text, is the list of ALL the open roles
// (written under Careers > Jobs in the admin panel): one row for each, with a button to read about the role and one to apply.

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
              <h3>
                {jobsHeading}
                {jobs.length > 0 && <span className="cj-jobs-count">{jobs.length}</span>}
              </h3>
              {jobsText && <p className="cj-jobs-text">{jobsText}</p>}
              {jobs.length === 0 ? (
                <p className="ro-empty">{jobsEmpty}</p>
              ) : (
                <ul className="cj-roles">
                  {jobs.map((j) => (
                    <li key={j.id} className="cj-role">
                      <Link href={`/careers/${j.slug}`} className="cj-role-main">
                        <span className="cj-role-t">{j.title}</span>
                        <span className="cj-role-m">{[j.team, j.workType, j.workMode, j.location, j.experience].filter(Boolean).join(" · ")}</span>
                      </Link>
                      <span className="cj-role-act">
                        <Link href={`/careers/${j.slug}`} className="ro-view">
                          View
                        </Link>
                        <Link href={`/careers/${j.slug}#apply`} className="ro-apply">
                          Apply now
                        </Link>
                      </span>
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
