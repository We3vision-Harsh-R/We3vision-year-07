import type { ComponentType } from "react";
import type { PageSection } from "@/lib/cms/pages";
import type { SectionType } from "@/lib/cms/sections";
import type { SiteSettings } from "@/lib/cms/settings";
import { Advantages } from "./advantages";
import { Backdrop } from "./backdrop";
import { Blogs } from "./blogs";
import { Contact } from "./contact";
import { Hero } from "./hero";
import { Highlights } from "./highlights";
import { Industries } from "./industries";
import { PageHero } from "./page-hero";
import { Reach } from "./reach";
import type { SectionComponent } from "./shared";
import { Services } from "./services";
import { Story } from "./story";
import { Strengths } from "./strengths";
import { Team } from "./team";
import { Timeline } from "./timeline";

// Adding a section type: define it in lib/cms/sections.ts, build the component, register it here.
// TypeScript enforces that every section type has a renderer with matching data.
const RENDERERS: { [T in SectionType]: SectionComponent<T> } = {
  hero: Hero,
  story: Story,
  strengths: Strengths,
  services: Services,
  highlights: Highlights,
  industries: Industries,
  advantages: Advantages,
  blogs: Blogs,
  reach: Reach,
  contact: Contact,
  backdrop7: Backdrop,
  pageHero: PageHero,
  timeline: Timeline,
  team: Team,
};

type AnyRenderer = ComponentType<{ data: Record<string, unknown>; site: SiteSettings }>;

/** Renders the sections of a page (used by the live pages AND the admin draft preview). */
export function PageSections({ sections, site }: { sections: PageSection[]; site: SiteSettings }) {
  return (
    <>
      {sections.map((section) => {
        const Component = RENDERERS[section.type] as unknown as AnyRenderer;
        return <Component key={section.id} data={section.data} site={site} />;
      })}
    </>
  );
}
