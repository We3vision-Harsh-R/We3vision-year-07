import { emptyValue } from "./fields";
import { SECTIONS, type SectionType } from "./sections";

// Kept apart from ./pages on purpose: ./pages imports the default texts of every page (~370 KB of source). A client component (the admin page
// editor) that imports ./pages would ship all of them to the browser. Client files import from HERE; ./pages re-exports these for the server.
export type PageSection = { id: string; type: SectionType; data: Record<string, unknown> };
export type PageContent = { sections: PageSection[] };

export function newSection(type: SectionType): PageSection {
  return { id: crypto.randomUUID(), type, data: emptyValue(SECTIONS[type].fields) };
}
