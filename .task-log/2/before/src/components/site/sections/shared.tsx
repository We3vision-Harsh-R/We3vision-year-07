import type { ComponentType } from "react";
import type { SectionData, SectionType } from "@/lib/cms/sections";
import type { SiteSettings } from "@/lib/cms/settings";

/** which look the sections of a page have: the redesigned one ("modern", the service pages) or the earlier one ("classic": home, about, metaverse, brand design) */
export type Skin = "classic" | "modern";

export type SectionProps<T extends SectionType> = { data: SectionData<T>; site: SiteSettings; /** the id of the section on its page (a page can use a type twice) */ sectionId?: string; skin?: Skin };
export type SectionComponent<T extends SectionType> = ComponentType<SectionProps<T>>;
