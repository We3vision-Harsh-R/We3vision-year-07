"use client";

import { useCareer } from "@/lib/career-store";

// The last section of the Careers page: Surat Junction, where We3vision has its office. The station itself (the platform, the office building
// and the train that arrives) is drawn by the railway of the page (career/railway.tsx) in the empty place on the right. Nothing arrives here
// until a visitor has sent their ticket.

export function CareerDestination({ chip, heading, text, station, address, buttonLabel, buttonHref }: { chip: string; heading: string; text: string; station: string; address: string; buttonLabel: string; buttonHref: string }) {
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
