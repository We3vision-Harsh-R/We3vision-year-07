import type { ComponentType } from "react";
import type { SectionType } from "@/lib/cms/sections";
import type { MobileSection, MobileSectionProps } from "../types";
import { AboutChaptersSection } from "./aboutChapters";
import { AboutHeroSection } from "./aboutHero";
import { AboutWorldSection } from "./aboutWorld";
import { AdvantagesSection } from "./advantages";
import { ArchGallerySection } from "./archGallery";
import { AutomateSection } from "./automate";
import { Backdrop7Section } from "./backdrop7";
import { BlogFeaturedSection, BlogPicksSection, CtaBandSection } from "./blogExtra";
import { BlogsSection } from "./blogs";
import { BrandBoardSection } from "./brandBoard";
import { CareerDestinationSection } from "./careerDestination";
import { CareerHelpDeskSection } from "./careerHelpDesk";
import { CareerJourneySection } from "./careerJourney";
import { CareerOpeningsSection } from "./careerOpenings";
import { CareerTeamsSection } from "./careerTeams";
import { CareerValuesSection } from "./careerValues";
import { ContactSection } from "./contact";
import { FaqSection } from "./faq";
import { FlowSection } from "./flow";
import { GuideSection } from "./guide";
import { HeroSection } from "./hero";
import { HighlightsSection } from "./highlights";
import { IndustriesSection } from "./industries";
import { PageHeroSection } from "./pageHero";
import { ProcessSection } from "./process";
import { ProjectsSection } from "./projects";
import { ReachSection } from "./reach";
import { ServicesSection } from "./services";
import { SketchCanvasSection } from "./sketchCanvas";
import { StorySection } from "./story";
import { StrengthsSection } from "./strengths";
import { TagsSection } from "./tags";
import { TeamSection } from "./team";
import { TeamJourneySection } from "./teamJourney";
import { TeamManifestoSection } from "./teamManifesto";
import { TeamOfficeSection } from "./teamOffice";
import { TeamValuesSection } from "./teamValues";
import { TimelineSection } from "./timeline";
import { VrDevicesSection } from "./vrDevices";
import { VrEmergeSection } from "./vrEmerge";
import { VrEntrySection } from "./vrEntry";
import { VrFloorSection } from "./vrFloor";
import { VrProcessSection } from "./vrProcess";
import { VrQuizSection } from "./vrQuiz";
import { VrSpaceSection } from "./vrSpace";
import { WordHeroSection } from "./wordHero";

// One mobile component per CMS section type (SECTIONS in src/lib/cms/sections.ts). TypeScript enforces that none is missing and that each one
// gets the data of its own type. To give ONE page a different look for a type, pass `overrides` to renderMobilePage (see render.tsx).
export const MOBILE_SECTIONS: { [T in SectionType]: MobileSection<T> } = {
  hero: HeroSection,
  story: StorySection,
  brandBoard: BrandBoardSection,
  strengths: StrengthsSection,
  services: ServicesSection,
  highlights: HighlightsSection,
  industries: IndustriesSection,
  advantages: AdvantagesSection,
  blogs: BlogsSection,
  blogFeatured: BlogFeaturedSection,
  blogPicks: BlogPicksSection,
  ctaBand: CtaBandSection,
  reach: ReachSection,
  contact: ContactSection,
  backdrop7: Backdrop7Section,
  pageHero: PageHeroSection,
  wordHero: WordHeroSection,
  archGallery: ArchGallerySection,
  projects: ProjectsSection,
  flow: FlowSection,
  automate: AutomateSection,
  faq: FaqSection,
  process: ProcessSection,
  tags: TagsSection,
  timeline: TimelineSection,
  guide: GuideSection,
  vrEntry: VrEntrySection,
  aboutWorld: AboutWorldSection,
  aboutHero: AboutHeroSection,
  aboutChapters: AboutChaptersSection,
  vrSpace: VrSpaceSection,
  vrFloor: VrFloorSection,
  vrEmerge: VrEmergeSection,
  vrDevices: VrDevicesSection,
  vrQuiz: VrQuizSection,
  vrProcess: VrProcessSection,
  sketchCanvas: SketchCanvasSection,
  team: TeamSection,
  teamOffice: TeamOfficeSection,
  careerJourney: CareerJourneySection,
  careerDestination: CareerDestinationSection,
  careerOpenings: CareerOpeningsSection,
  careerValues: CareerValuesSection,
  careerTeams: CareerTeamsSection,
  careerHelpDesk: CareerHelpDeskSection,
  teamManifesto: TeamManifestoSection,
  teamJourney: TeamJourneySection,
  teamValues: TeamValuesSection,
};

/** the section types whose first card is the page's hero (it then owns the page's h1) */
export const HERO_LIKE: ReadonlySet<SectionType> = new Set<SectionType>(["pageHero", "wordHero", "aboutHero", "aboutWorld", "careerJourney", "vrEntry"]);

/** A component for any type (the registry is typed per type; render.tsx picks by the runtime type). */
export type AnyMobileSection = ComponentType<MobileSectionProps<SectionType>>;
