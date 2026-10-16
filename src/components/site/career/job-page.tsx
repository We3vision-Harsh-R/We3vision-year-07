import "@/styles/careers.css";
import Link from "next/link";
import type { CareerQuestionView, JobView } from "@/lib/careers-shared";
import { JobApply } from "../lazy";

// The page of one job (/careers/<address>): what the job is, what the person will do, what is asked, what they get, and the form to apply.
// Everything comes from the admin panel (Careers > Jobs). The look is in globals.css (.jb-*).

const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const day = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="jb-block">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="jb-points">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

export function JobPage({ job, questions }: { job: JobView; questions: CareerQuestionView[] }) {
  const facts = [job.workType, job.workMode, job.location, job.experience, job.openings > 1 ? `${job.openings} openings` : "1 opening"].filter(Boolean);
  const intro = paragraphs(job.description);
  return (
    <article className="jb">
      <div className="jb-in">
        <nav className="jb-back" aria-label="Back">
          <Link href="/careers#openings">← All open positions</Link>
        </nav>

        <div className="jb-grid">
          <div className="jb-main">
        <header className="jb-head">
          <p className="jb-strip">
            <span>We3vision Railways</span>
            <span>Position{job.team ? ` · ${job.team}` : ""}</span>
          </p>
          <h1>{job.title}</h1>
          {job.summary && <p className="jb-sum">{job.summary}</p>}
          <ul className="jb-facts">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="jb-meta">
            {job.postedLabel}
            {job.closesAt ? ` · Last day to apply: ${day(job.closesAt)}` : ""}
          </p>
          <a href="#apply" className="jb-cta">
            Apply for this position
          </a>
        </header>

          <div className="jb-body">
            {intro.length > 0 && (
              <Block title="About the role">
                {intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Block>
            )}
            {job.responsibilities.length > 0 && (
              <Block title="What you will do">
                <Points items={job.responsibilities} />
              </Block>
            )}
            {job.requirements.length > 0 && (
              <Block title="What we look for">
                <Points items={job.requirements} />
              </Block>
            )}
            {job.perks.length > 0 && (
              <Block title="What you get">
                <Points items={job.perks} />
              </Block>
            )}
          </div>
          </div>

          <aside className="jb-side" aria-label="Quick facts">
            <dl>
              {job.team && (
                <div>
                  <dt>Team</dt>
                  <dd>{job.team}</dd>
                </div>
              )}
              <div>
                <dt>Type</dt>
                <dd>{job.workType}</dd>
              </div>
              <div>
                <dt>Work mode</dt>
                <dd>{job.workMode}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{job.location}</dd>
              </div>
              {job.experience && (
                <div>
                  <dt>Experience</dt>
                  <dd>{job.experience}</dd>
                </div>
              )}
              {job.salary && (
                <div>
                  <dt>Salary</dt>
                  <dd>{job.salary}</dd>
                </div>
              )}
              <div>
                <dt>Openings</dt>
                <dd>{job.openings}</dd>
              </div>
            </dl>
            <a href="#apply" className="jb-cta jb-cta-wide">
              Apply now
            </a>
            <p className="jb-side-note">Questions first? Write to hr@we3vision.com.</p>
          </aside>
        </div>

        <section id="apply" className="jb-apply" aria-labelledby="jb-apply-t">
          <p className="jb-strip">
            <span>Boarding pass</span>
            <span>{job.title}</span>
          </p>
          <h2 id="jb-apply-t">Apply for this position</h2>
          <p className="jb-apply-sub">It takes about five minutes. Our HR team reads every application and writes back.</p>
          <JobApply roleId={job.id} roleTitle={job.title} questions={questions} />
        </section>
      </div>
    </article>
  );
}
