import type { ComponentType } from "react";
import type { BlogEntry } from "@/lib/blog-shared";
import type { JobView } from "@/lib/careers-shared";
import type { SectionData, SectionType } from "@/lib/cms/sections";
import type { SiteSettings } from "@/lib/cms/settings";
import type { ProjectView } from "@/lib/projects";
import type { ContactInfo } from "../app/contact";

/** Data a section may need besides its own content; loaded once by renderMobilePage, only when a section of the page uses it. */
export type MobileData = { projects?: ProjectView[]; posts?: BlogEntry[]; jobs?: JobView[] };

/** What every mobile section component receives. */
export type MobileSectionProps<T extends SectionType> = {
  /** the section's content from the CMS: the same words as the laptop page */
  data: SectionData<T>;
  site: SiteSettings;
  contact: ContactInfo | null;
  /** the section's id on its page (a page can use a type twice) */
  id: string;
  /** its place on the page: 0 = the first section (a hero there owns the page's h1) */
  index: number;
  /** the slug of the page */
  page: string;
  extra: MobileData;
};

export type MobileSection<T extends SectionType> = ComponentType<MobileSectionProps<T>>;
