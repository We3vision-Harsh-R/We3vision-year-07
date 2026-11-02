import { VisitorsManager } from "@/components/admin/visitors-manager";
import { requireAdmin } from "@/lib/auth";
import { getPresenceConfig, listVisitors, liveCount } from "@/lib/presence-server";

export const metadata = { title: "Visitors" };
export const dynamic = "force-dynamic";

export default async function VisitorsPage() {
  await requireAdmin();
  const [cfg, rows] = await Promise.all([getPresenceConfig(), listVisitors()]);
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Visitors</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
          A first-time visitor of the laptop website is asked for a name, nothing else. Every visitor sees the cursors, with names, of the other
          visitors who are on the same page right now. Choose how many cursors one visitor sees: the visitors who came in first are shown first. The
          list below shows who opened the website, when and with which device.
        </p>
      </div>
      <VisitorsManager initial={cfg} rows={rows} live={liveCount()} />
    </div>
  );
}
