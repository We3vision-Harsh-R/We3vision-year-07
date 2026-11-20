"use client";
/* eslint-disable @next/next/no-img-element -- team photos are links set in the admin panel (Team) and can point anywhere */
import { useMemo, useState } from "react";
import "@/styles/team-crew.css";
import { GlowEdge } from "../glow-edge";
import { Reveal } from "../reveal";
import { SectionHead, Wide } from "../ui";
import type { TeamPerson } from "@/lib/team-shared";
import { byDepartment, tierOf } from "@/lib/team-shared";

// "The crew": every person of the company as a card, in the look of the people cards of the About page (glass card with the glowing edge, a
// gradient monogram, violet name, orchid role). Admin > Team feeds it, like the office above. Department chips filter the cards; the leaders
// are wider. Without a photo the card shows initials (or the initials of the role for an open seat, "Team member").

const initials = (s: string) =>
  s
    .split(/[\s/&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

const isOpen = (p: TeamPerson) => /^team member$/i.test(p.name.trim());

function Card({ p, i }: { p: TeamPerson; i: number }) {
  const lead = tierOf(p.dept) === "cxo";
  const open = isOpen(p);
  return (
    <Reveal delay={(i % 4) * 80} className="h-full">
      <article className={`bglow card-glass tcr-card${lead ? " tcr-lead" : ""}${open ? " tcr-open" : ""}`}>
        <GlowEdge />
        <span className="tcr-av" aria-hidden="true">
          {p.photo ? <img src={p.photo} alt="" loading="lazy" decoding="async" /> : <b className="text-vfade">{initials(open ? p.role : p.name)}</b>}
        </span>
        <h3>{open ? "Joining soon" : p.name}</h3>
        <p className="tcr-role">{p.role}</p>
        <span className="tcr-dept">{p.dept}</span>
        {p.bio && !open && <p className="tcr-bio">{p.bio}</p>}
        {p.linkedin && (
          <a className="tcr-link" href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on LinkedIn`}>
            LinkedIn <span aria-hidden="true">→</span>
          </a>
        )}
      </article>
    </Reveal>
  );
}

export function TeamCrew({ id, chip, heading, intro, people }: { id: string; chip: string; heading: string; intro: string; people: TeamPerson[] }) {
  const depts = useMemo(() => byDepartment(people), [people]);
  const [active, setActive] = useState("All");
  const shown = active === "All" ? people : people.filter((p) => p.dept === active);
  const tabs = [{ name: "All", n: people.length }, ...depts.map((d) => ({ name: d.name, n: d.people.length }))];
  return (
    <section id={id} className="py-24 sm:py-32">
      <Wide>
        <SectionHead chip={chip} heading={heading} intro={intro} />
        <div className="tcr-tabs" role="group" aria-label="Departments">
          {tabs.map((d) => (
            <button key={d.name} type="button" className="tcr-tab" aria-pressed={active === d.name} onClick={() => setActive(d.name)}>
              {d.name} <span>{d.n}</span>
            </button>
          ))}
        </div>
        <div className="tcr-grid" key={active}>
          {shown.map((p, i) => (
            <Card key={p.id} p={p} i={i} />
          ))}
        </div>
      </Wide>
    </section>
  );
}
