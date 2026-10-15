import type { PageSection } from "@/lib/cms/pages";

// The text of a technology page, taken from its sections (the defaults in lib/cms/content/tech.ts, or the version published from the admin panel).
// The six pages each draw it in their own way, so they all read the same plain shape.

export type TechData = {
  hero: { chip: string; heading: string; text: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
  story: string;
  services: { heading: string; intro: string; cards: { title: string; description: string }[] };
  process: { heading: string; intro: string; items: { title: string; text: string; points: string[] }[] } | null;
  tools: { heading: string; items: string[] };
  industries: { heading: string; intro: string; items: { name: string; description: string }[] } | null;
  why: { heading: string; intro: string; items: { title: string; description: string }[] };
  faq: { question: string; answer: string }[];
  related: { title: string; description: string; href: string }[];
};

const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const arr = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? (v as Record<string, unknown>[]) : []);
const lines = (v: unknown) => str(v).split("\n").map((s) => s.trim()).filter(Boolean);

export function techData(sections: PageSection[]): TechData {
  const first = (t: string) => sections.find((s) => s.type === t)?.data ?? {};
  const all = (t: string) => sections.filter((s) => s.type === t).map((s) => s.data);
  const hero = first("pageHero");
  const svc = all("services");
  const main = svc[0] ?? {};
  const rel = svc.length > 1 ? svc[svc.length - 1] : {};
  const proc = sections.find((s) => s.type === "process")?.data;
  const ind = sections.find((s) => s.type === "industries")?.data;
  const why = first("advantages");
  return {
    hero: {
      chip: str(hero.chip), heading: str(hero.heading), text: str(hero.text),
      primaryLabel: str(hero.primaryLabel, "Get a free quote"), primaryHref: str(hero.primaryHref, "#contact"),
      secondaryLabel: str(hero.secondaryLabel, "What we build"), secondaryHref: str(hero.secondaryHref, "#services"),
    },
    story: str(first("story").body),
    services: { heading: str(main.heading), intro: str(main.intro), cards: arr(main.cards).map((c) => ({ title: str(c.title), description: str(c.description) })) },
    process: proc ? { heading: str(proc.heading), intro: str(proc.intro), items: arr(proc.items).map((i) => ({ title: str(i.title), text: str(i.text), points: lines(i.points) })) } : null,
    tools: { heading: str(first("tags").heading), items: lines(first("tags").items) },
    industries: ind ? { heading: str(ind.heading), intro: str(ind.intro), items: arr(ind.items).map((i) => ({ name: str(i.name), description: str(i.description) })) } : null,
    why: { heading: str(why.heading), intro: str(why.intro), items: arr(why.items).map((i) => ({ title: str(i.title), description: str(i.description) })) },
    faq: arr(first("faq").items).map((q) => ({ question: str(q.question), answer: str(q.answer) })),
    related: arr(rel.cards).map((c) => ({ title: str(c.title), description: str(c.description), href: str(c.href) })),
  };
}

/** "Headless CMS\nDevelopment Services" -> one line for places where the break is not wanted */
export const oneLine = (s: string) => s.replace(/\n/g, " ");
/** the text of the story, with *stars* removed */
export const plainStory = (s: string) => s.replace(/\*/g, "");
/** the paragraphs of the story, as arrays of [text, bold] pieces */
export const storyParts = (s: string): { text: string; em: boolean }[][] =>
  s.split(/\n\n+/).map((p) => p.split("*").map((text, i) => ({ text, em: i % 2 === 1 })).filter((x) => x.text));
