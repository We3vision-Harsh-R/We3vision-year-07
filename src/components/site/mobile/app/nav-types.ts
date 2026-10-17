// What the bottom tab bar of an app screen is built from. Pure data, safe for server and client code.
export type TabIconName = "overview" | "services" | "process" | "tech" | "industries" | "why" | "faq" | "work" | "blog" | "contact" | "price" | "team" | "apps";

/** one tab: `id` is the id of the section it scrolls to (null = the top of the screen) */
export type NavTab = { id: string | null; label: string; icon: TabIconName };

/** one line of the "On this page" list in the Apps sheet */
export type OutlineItem = { id: string; label: string };
