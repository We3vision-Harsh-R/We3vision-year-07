import type { ComponentType } from "react";
import type { PageSection } from "@/lib/cms/pages";
import type { SectionType } from "@/lib/cms/sections";
import type { SiteSettings } from "@/lib/cms/settings";
import { AboutChaptersSection } from "./about-chapters";
import { AboutHeroSection } from "./about-hero";
import { AboutWorldSection } from "./about-world";
import { Advantages } from "./advantages";
import { ArchGallery } from "./arch-gallery";
import { Automate } from "../lazy";
import { Backdrop } from "./backdrop";
import { BlogFeatured, BlogPicks, CtaBand } from "./blog-extra";
import { Blogs } from "./blogs";
import { CareerDestinationSection, CareerHelpDeskSection, CareerJourneySection, CareerOpeningsSection, CareerTeamsSection, CareerValuesSection } from "./career";
import { Contact } from "./contact";
import { Faq } from "../lazy";
import { Flow } from "../lazy";
import { Guide } from "./guide";
import { Hero } from "./hero";
import { Highlights } from "./highlights";
import { Industries } from "./industries";
import { PageHero } from "./page-hero";
import { ProjectsGrid } from "./projects-grid";
import { getProjects, type ProjectView } from "@/lib/projects";
import { Process } from "./process";
import { Reach } from "./reach";
import type { SectionComponent, Skin } from "./shared";
import { Services } from "./services";
import { SketchCanvasSection } from "./sketch-canvas";
import { BrandBoard } from "../lazy";
import { Story } from "./story";
import { Strengths } from "./strengths";
import { Tags } from "./tags";
import { Team } from "./team";
import { TeamJourney, TeamManifesto, TeamValues } from "./team-story";
import { TeamOfficeSection } from "./team-office";
import { Timeline } from "../lazy";
import { VrDevicesSection } from "./vr-devices";
import { VrEmerge } from "./vr-emerge";
import { VrEntry } from "./vr-entry";
import { VrFloorSection } from "./vr-floor";
import { VrProcessSection } from "./vr-process";
import { VrQuizSection } from "./vr-quiz";
import { VrSpaceSection } from "./vr-space";
import { WordHero } from "./word-hero";

// Adding a section type: define it in lib/cms/sections.ts, build the component, register it here.
// TypeScript enforces that every section type has a renderer with matching data.
const RENDERERS: { [T in SectionType]: SectionComponent<T> } = {
  hero: Hero,
  story: Story,
  brandBoard: BrandBoard,
  strengths: Strengths,
  services: Services,
  highlights: Highlights,
  industries: Industries,
  advantages: Advantages,
  blogs: Blogs,
  blogFeatured: BlogFeatured,
  blogPicks: BlogPicks,
  ctaBand: CtaBand,
  reach: Reach,
  contact: Contact,
  backdrop7: Backdrop,
  pageHero: PageHero,
  wordHero: WordHero,
  archGallery: ArchGallery,
  projects: ProjectsGrid,
  flow: Flow,
  automate: Automate,
  faq: Faq,
  process: Process,
  tags: Tags,
  timeline: Timeline,
  guide: Guide,
  vrEntry: VrEntry,
  aboutWorld: AboutWorldSection,
  aboutHero: AboutHeroSection,
  aboutChapters: AboutChaptersSection,
  vrSpace: VrSpaceSection,
  vrFloor: VrFloorSection,
  vrEmerge: VrEmerge,
  vrDevices: VrDevicesSection,
  vrQuiz: VrQuizSection,
  vrProcess: VrProcessSection,
  sketchCanvas: SketchCanvasSection,
  team: Team,
  teamOffice: TeamOfficeSection,
  careerJourney: CareerJourneySection,
  careerDestination: CareerDestinationSection,
  careerOpenings: CareerOpeningsSection,
  careerValues: CareerValuesSection,
  careerTeams: CareerTeamsSection,
  careerHelpDesk: CareerHelpDeskSection,
  teamManifesto: TeamManifesto,
  teamJourney: TeamJourney,
  teamValues: TeamValues,
};

type AnyRenderer = ComponentType<{ data: Record<string, unknown>; site: SiteSettings; sectionId?: string; skin?: Skin; page?: string; projects?: ProjectView[]; glance?: Record<string, unknown> }>;

/** Renders the sections of a page (used by the live pages AND the admin draft preview). */
export async function PageSections({ sections, site, skin = "classic", page }: { sections: PageSection[]; site: SiteSettings; skin?: Skin; page?: string }) {
  // the projects of the admin panel are only read when a section of this page shows them
  const needsProjects = sections.some((x) => x.type === "projects" || (x.type === "archGallery" && typeof x.data.group === "string" && x.data.group !== ""));
  const projects = needsProjects ? await getProjects() : undefined;
  // home page: the hero and "At a glance" are one first screen (home-intro.tsx); the facts of the glance section go to the hero and the glance
  // section itself is not drawn again (both stay separate sections in the admin panel, so they are edited as before)
  const glance = page === "home" && sections.some((x) => x.type === "hero") ? sections.find((x) => x.type === "highlights") : undefined;
  return (
    <>
      {sections.map((section) => {
        if (section === glance) return null;
        const Component = RENDERERS[section.type] as unknown as AnyRenderer;
        return <Component key={section.id} data={section.data} site={site} sectionId={section.id} skin={skin} page={page} projects={projects} glance={section.type === "hero" ? glance?.data : undefined} />;
      })}
    </>
  );
}
