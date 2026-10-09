import type { ComponentType } from "react";
import type { SectionData, SectionType } from "@/lib/cms/sections";
import type { SiteSettings } from "@/lib/cms/settings";
import type { ProjectView } from "@/lib/projects";

/** which look the sections of a page have: the redesigned one ("modern", the service pages) or the earlier one ("classic": home, about, metaverse, brand design) */
export type Skin = "classic" | "modern";

export type SectionProps<T extends SectionType> = { data: SectionData<T>; site: SiteSettings; /** the id of the section on its page (a page can use a type twice) */ sectionId?: string; skin?: Skin; /** the slug of the page (some sections look different on different pages) */ page?: string; /** the published projects (only given to the sections that show them) */ projects?: ProjectView[] };
export type SectionComponent<T extends SectionType> = ComponentType<SectionProps<T>>;
