import "@/styles/home-intro.css";
import Image from "next/image";
import type { CSSProperties } from "react";
import { SmartLink } from "./smart-link";

type Badge = { label: string; image: string };
type Fact = { value: string; label: string };

// THE FIRST SCREEN OF THE HOME PAGE (laptop / desktop), from 2026-10-24: it replaces the old pinned particle scene (the ball that burst into
// particles, the service boxes and the walking guide) and the separate "At a glance" section, which are now one calm screen:
//   left   "Celebrating / 7 Years of We3vision" in big type, the real page heading (h1, for Google) under it and two buttons
//   right  the anniversary seal: a ring with one mark for every year since the company was founded (2019 ... now) and the big 7 in it, and under
//          it the two recognitions (Startup India and MSME, from Admin > Settings > badges) as clear logo tiles, so visitors see them at once
//   bottom the facts of "At a glance" (Admin > the Home page > At a glance) as one row of numbers
// No canvas, no scroll pinning, no endless animation: the pieces only fade in once (CSS) and the seal draws its ring once, so the page is light.
// The texts come from the hero section of the page (above, mark, below, title) and the facts from its "highlights" section (PageSections hands
// them over on the home page). Styles: src/styles/home-intro.css ("hi-").

export function HomeIntro({
  title,
  above,
  mark,
  below,
  chip,
  facts,
  badges,
}: {
  title: string;
  above: string;
  mark: string;
  below: string;
  chip: string;
  facts: Fact[];
  badges: Badge[];
}) {
  // the years of the seal: from the year the company was founded (a fact such as "2019 Founded in Surat") as many years as the big number says
  const founded = Number(facts.find((f) => /found/i.test(f.label))?.value);
  const span = Number(mark);
  const years = Number.isFinite(founded) && Number.isFinite(span) && span > 0 && span < 40 ? Array.from({ length: span + 1 }, (_, i) => founded + i) : [];
  const logos = badges.filter((b) => b.image);

  // the ring: an arc from the lower left round the top to the lower right, one mark for every year
  const R = 168;
  const A0 = 140; // degrees (0 = right, clockwise in screen space)
  const A1 = 400;
  const at = (deg: number, r = R) => {
    const a = (deg * Math.PI) / 180;
    return { x: 200 + Math.cos(a) * r, y: 200 + Math.sin(a) * r };
  };
  const p0 = at(A0);
  const p1 = at(A1);
  const arc = `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A${R} ${R} 0 1 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;

  return (
    <section className="hi" aria-labelledby="hi-title">
      <div className="hi-main">
        <div className="hi-copy">
          {above && <p className="hi-eyebrow">{above}</p>}
          <p className="hi-display" aria-hidden>
            <span className="hi-display-num">{mark}</span> {below}
          </p>
          <h1 id="hi-title" className="hi-title">
            {title}
          </h1>
          <div className="hi-cta">
            <SmartLink href="/contact" className="hi-btn is-main">
              Start a project
            </SmartLink>
            <SmartLink href="/portfolio" className="hi-btn">
              See our work
            </SmartLink>
          </div>
        </div>

        <div className="hi-side">
          <div className="hi-seal" aria-hidden>
            <svg viewBox="0 0 400 400" className="hi-ring">
              <path d={arc} className="hi-ring-track" />
              <path d={arc} className="hi-ring-draw" pathLength={1} />
              {years.map((y, i) => {
                const deg = A0 + ((A1 - A0) * i) / Math.max(1, years.length - 1);
                const dot = at(deg);
                const lab = at(deg, R + 24);
                const last = i === years.length - 1;
                return (
                  <g key={y} className="hi-year" data-last={last} style={{ "--i": i } as CSSProperties}>
                    <circle cx={dot.x} cy={dot.y} r={last ? 6 : 3.4} />
                    <text x={lab.x} y={lab.y} dominantBaseline="middle" textAnchor="middle">
                      {y}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="hi-seal-in">
              <span className="hi-seal-num">{mark}</span>
              <span className="hi-seal-cap">years</span>
            </div>
          </div>

          {logos.length > 0 && (
            <div className="hi-rec">
              <p className="hi-rec-t">Recognised by</p>
              <ul>
                {logos.map((b) => (
                  <li key={b.image}>
                    <Image src={b.image} alt={b.label} title={b.label} width={300} height={110} unoptimized />
                    <span>{b.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {facts.length > 0 && (
        <div className="hi-facts">
          {chip && <p className="hi-facts-t">{chip}</p>}
          <dl>
            {facts.map((f, i) => (
              <div key={i} style={{ "--i": i } as CSSProperties}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
