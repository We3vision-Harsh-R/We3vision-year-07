/* eslint-disable @next/next/no-img-element -- team photos are links set in the admin panel (Team) and can point anywhere, like the kit's <Pic> */
import type { TeamPerson } from "@/lib/team-shared";
import type { MobileSection, MobileSectionProps } from "../../types";
import { Section } from "../../../app";
import { RelayScrubber } from "./client";
import { Rich, oneLine, paragraphs } from "../../../app/text";

// /team as a "Contacts" app: the office's people (Admin > Team, the same list the laptop office shows) as favourites + a list per
// department with an index bar; a person with a bio opens like a contact card. Styles: (m)/m/team/page.css ("mp-team-").

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

const slug = (s: string) => "dept-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Avatar({ p, size }: { p: TeamPerson; size?: "lg" }) {
  return (
    <span className={size === "lg" ? "mp-team-av mp-team-av-lg" : "mp-team-av"} aria-hidden="true">
      {p.photo ? <img src={p.photo} alt="" loading="lazy" decoding="async" /> : initials(p.name)}
    </span>
  );
}

function Person({ p }: { p: TeamPerson }) {
  const head = (
    <>
      <Avatar p={p} />
      <span className="mp-team-who">
        <b>{p.name}</b>
        <span>{p.role}</span>
      </span>
    </>
  );
  if (!p.bio && !p.linkedin) return <li className="mp-team-row">{head}</li>;
  return (
    <li>
      <details className="mp-team-card">
        <summary className="mp-team-row">
          {head}
          <span className="mp-team-i" aria-hidden="true">
            i
          </span>
        </summary>
        <div className="mp-team-more">
          {p.bio && <p>{p.bio}</p>}
          {p.linkedin && (
            <a className="mp-team-link" href={p.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
        </div>
      </details>
    </li>
  );
}

/** "Meet The Team": the office of the laptop, here as an address book */
export function TeamOffice({ data, id, people }: MobileSectionProps<"teamOffice"> & { people: TeamPerson[] }) {
  const depts: { name: string; list: TeamPerson[] }[] = [];
  for (const p of people) {
    const d = depts.find((x) => x.name === p.dept) ?? depts[depts.push({ name: p.dept, list: [] }) - 1];
    d.list.push(p);
  }
  const [lead, ...rest] = depts;
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {lead && (
        <ul className="mp-team-favs" aria-label={lead.name}>
          {lead.list.map((p) => (
            <li key={p.id}>
              <Avatar p={p} size="lg" />
              <b>{p.name}</b>
              <span>{p.role}</span>
            </li>
          ))}
        </ul>
      )}
      {rest.length > 0 && (
        <nav className="mp-team-index" aria-label="Departments">
          {rest.map((d) => (
            <a key={d.name} href={"#" + slug(d.name)}>
              {d.name}
            </a>
          ))}
        </nav>
      )}
      {rest.map((d) => (
        <div key={d.name} id={slug(d.name)} className="mp-team-dept">
          <p className="mp-team-dh">
            {d.name} <span>{d.list.length}</span>
          </p>
          <ul className="mp-team-list">
            {d.list.map((p) => (
              <Person key={p.id} p={p} />
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}

/** "Behind every screen": open prose (first paragraph larger) and the quote with a tint rule, no boxes */
export const TeamManifesto: MobileSection<"teamManifesto"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <div className="mp-team-prose">
        {paragraphs(data.body).map((p, i) => (
          <p key={i}>
            <Rich text={p} />
          </p>
        ))}
      </div>
    {data.quote && (
      <figure className="mp-team-quote">
        <blockquote>{data.quote}</blockquote>
        {data.quoteBy && <figcaption>{data.quoteBy}</figcaption>}
      </figure>
    )}
  </Section>
);

/** "How a project moves through the team": a scrubber of hand-offs (client.tsx) */
export const TeamJourney: MobileSection<"teamJourney"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <RelayScrubber label={oneLine(data.heading) || "Steps"} steps={data.steps.map((s) => ({ stage: oneLine(s.stage), who: s.who, text: s.text }))} />
  </Section>
);
