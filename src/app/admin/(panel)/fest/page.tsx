import { FestManager, type FestPage } from "@/components/admin/fest-manager";
import { requireAdmin } from "@/lib/auth";
import { PAGES } from "@/lib/cms/pages";
import { getFestConfig } from "@/lib/fest-server";

export const metadata = { title: "Fest" };

// the pages that are not CMS pages but groups of pages
const GROUPS: FestPage[] = [
  { path: "/blog/*", title: "Every blog article", group: "Groups of pages" },
  { path: "/portfolio/*", title: "Every portfolio project", group: "Groups of pages" },
  { path: "/careers/*", title: "Every job page", group: "Groups of pages" },
];

export default async function FestPageAdmin() {
  await requireAdmin();
  const cfg = await getFestConfig();
  const pages: FestPage[] = [
    ...Object.values(PAGES).map((p) => ({ path: p.path, title: p.title, group: p.path === "/" ? "Home" : "Pages" })),
    ...GROUPS,
  ].sort((a, b) => (a.group === "Home" ? -1 : b.group === "Home" ? 1 : 0));
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fest</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
          Festival themes for the laptop and desktop website. Switch a festival on for the whole website or only for some pages; the decorations come
          in smoothly and never cover the content. With every festival off, the website shows its normal theme exactly as it is.
        </p>
      </div>
      <FestManager initial={cfg} pages={pages} />
    </div>
  );
}
