import { card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { SITE_VERSION, VERSION_LOG } from "@/lib/version";

export const metadata = { title: "Versions" };

export default async function VersionsPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Versions</h1>
        <p className="mt-1 text-base text-zinc-600">
          Every update of the website gets the next number. The live version is <b>{SITE_VERSION}</b>; it is also shown in the footer of the website and
          in the sidebar of this panel. Each version is also a git tag (v{SITE_VERSION}), so an older one can be found or restored.
        </p>
      </div>
      <ol className="space-y-4">
        {VERSION_LOG.map((e, i) => (
          <li key={e.v} className={card}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand px-3 py-1 text-sm font-semibold text-white">v{e.v}</span>
              {i === 0 && <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Live</span>}
              <h2 className="text-lg font-semibold text-zinc-900">{e.title}</h2>
              <span className="ml-auto text-sm text-zinc-500">{formatDate(new Date(`${e.date}T12:00:00+05:30`))}</span>
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-zinc-700">
              {e.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
