import type { MobileSection } from "../../types";
import { AppLink, Section } from "../../../app";
import { Lines } from "../../../app/text";
import { coverOf } from "@/lib/projects";
import { PortfolioBrowser } from "./client";

// /portfolio as Apple Photos: a quiet library header (Large Title, regular text, two buttons side by side), albums per category that filter
// the photo grid of every project (Admin > Projects, the same list as the laptop). Each photo opens the project. Styles: (m)/m/portfolio/page.css ("mp-pf-").

/** the top: heading, text and the two buttons */
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
        <div className="mp-pf-acts">
          {acts.map((a, i) => (
            <AppLink key={i} href={a.href} className={i === 0 ? "ma-btn ma-btn-fill" : "ma-btn ma-btn-glass"}>
              {a.label}
            </AppLink>
          ))}
        </div>
      )}
    </section>
  );
};

/** the projects: albums (a filter), then the grid */
export const PortfolioGrid: MobileSection<"projects"> = ({ data, id, extra }) => {
  const list = (extra.projects ?? []).filter((p) => !data.group || p.group === data.group);
  const items = list.map((p) => ({ id: p.id, slug: p.slug, title: p.title, category: p.category || "", cover: coverOf(p) || "" }));
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
      {items.length === 0 ? <p className="mp-pf-empty">The projects will appear here soon.</p> : <PortfolioBrowser items={items} />}
    </Section>
  );
};
