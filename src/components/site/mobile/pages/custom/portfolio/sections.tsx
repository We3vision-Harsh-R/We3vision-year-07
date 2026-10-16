/* eslint-disable @next/next/no-img-element -- project pictures are uploads / links from the admin panel (Projects), like the kit's <Pic> */
import type { MobileSection } from "../../types";
import { AppLink, Section } from "../../../app";
import { Lines } from "../../../app/text";
import { coverOf, type ProjectView } from "@/lib/projects";

// /portfolio as a "Photos" app: a slim library header, albums per category (sideways), then the photo grid of every project
// (Admin > Projects, the same list as the laptop). Each photo opens the project. Styles: (m)/m/portfolio/page.css ("mp-pf-").

const albumId = (s: string) => "album-" + (s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "all");

/** the top: heading, text and the two buttons as a segmented control */
export const PortfolioHead: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref },
    { label: data.secondaryLabel, href: data.secondaryHref },
  ].filter((a) => a.label && a.href);
  return (
    <section className="mp-pf-head">
      {data.chip && <p className="mp-pf-chip">{data.chip}</p>}
      <H className="mp-pf-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-pf-t">{data.text}</p>}
      {acts.length > 0 && (
        <nav className="mp-pf-seg">
          {acts.map((a, i) => (
            <AppLink key={i} href={a.href} className={i === 0 ? "is-on" : undefined}>
              {a.label}
            </AppLink>
          ))}
        </nav>
      )}
    </section>
  );
};

function Photo({ p, big }: { p: ProjectView; big?: boolean }) {
  const src = coverOf(p);
  return (
    <AppLink href={"/portfolio/" + p.slug} className={big ? "mp-pf-ph is-big" : "mp-pf-ph"}>
      {src ? <img src={src} alt={p.title} loading="lazy" decoding="async" /> : <span className="mp-pf-ph-l" aria-hidden="true">{p.title.trim().charAt(0).toUpperCase()}</span>}
      <span className="mp-pf-cap">
        <b>{p.title}</b>
        {p.category && <span>{p.category}</span>}
      </span>
    </AppLink>
  );
}

/** the projects: albums, then the grid */
export const PortfolioGrid: MobileSection<"projects"> = ({ data, id, extra }) => {
  const list = (extra.projects ?? []).filter((p) => !data.group || p.group === data.group);
  const albums: { name: string; list: ProjectView[] }[] = [];
  for (const p of list) {
    const name = p.category || "";
    const a = albums.find((x) => x.name === name) ?? albums[albums.push({ name, list: [] }) - 1];
    a.list.push(p);
  }
  const named = albums.filter((a) => a.name);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {list.length === 0 ? (
        <p className="ma-intro">The projects will appear here soon.</p>
      ) : (
        <>
          {named.length > 1 && (
            <ul className="mp-pf-albums" aria-label="Albums">
              {named.map((a) => {
                const src = coverOf(a.list[0]);
                return (
                  <li key={a.name}>
                    <a href={"#" + albumId(a.name)} className="mp-pf-album">
                      <span className="mp-pf-ac">{src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <span aria-hidden="true">{a.name.charAt(0).toUpperCase()}</span>}</span>
                      <b>{a.name}</b>
                      <span>{a.list.length}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          {named.length > 1 ? (
            albums.map((a) => (
              <div key={a.name || "other"} id={albumId(a.name)} className="mp-pf-grp">
                {a.name && <p className="mp-pf-gh">{a.name}</p>}
                <div className="mp-pf-grid">
                  {a.list.map((p, i) => (
                    <Photo key={p.id} p={p} big={i === 0 && a.list.length > 2} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="mp-pf-grid">
              {list.map((p, i) => (
                <Photo key={p.id} p={p} big={i === 0 && list.length > 2} />
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  );
};
