import type { SectionType } from "./sections";

// Kept apart from ./pages on purpose: ./pages imports the default texts of every page (~370 KB of source). A client component that imports ./pages
// would ship all of them to the browser. Client files import the page types from HERE; ./pages re-exports them for the server.
export type PageSection = { id: string; type: SectionType; data: Record<string, unknown> };
export type PageContent = { sections: PageSection[] };
