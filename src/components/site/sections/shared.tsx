import type { ComponentType } from "react";
import type { SectionData, SectionType } from "@/lib/cms/sections";
import type { SiteSettings } from "@/lib/cms/settings";

export type SectionProps<T extends SectionType> = { data: SectionData<T>; site: SiteSettings };
export type SectionComponent<T extends SectionType> = ComponentType<SectionProps<T>>;
