import { TeamManager } from "@/components/admin/team-manager";
import { requireAdmin } from "@/lib/auth";
import { getTeam } from "@/lib/team";

export const metadata = { title: "Team" };

export default async function TeamAdminPage() {
  await requireAdmin();
  const people = await getTeam();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
          The people in the office of the Team page. Add a person to a department and their avatar sits in that department&apos;s corner of the office.
          The department called Leadership sits in the middle at the top of the office, Managers at the long table under it, and the other departments are the teams. The preview shows the office before you save.
        </p>
      </div>
      <TeamManager initial={people} />
    </div>
  );
}
