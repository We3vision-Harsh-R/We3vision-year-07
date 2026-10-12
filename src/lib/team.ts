import "server-only";
import { db, hasDb } from "@/lib/db";
import { TEAM_MEMBERS } from "@/lib/cms/content/team";
import type { TeamPerson } from "@/lib/team-shared";

// The people of the office on the Team page (Team in the admin panel). Read rules like the pages: without a database the built-in people are
// shown; a database error is thrown, so that the last good cached page stays online.

const builtIn = (): TeamPerson[] =>
  TEAM_MEMBERS.map((m, i) => ({ id: `built-in-${i}`, name: m.name, role: m.role, dept: m.dept, bio: m.bio, photo: m.photo, linkedin: m.linkedin, girl: m.girl === "yes" }));

export async function getTeam(): Promise<TeamPerson[]> {
  if (!hasDb) return builtIn();
  const rows = await db.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return rows.map((r) => ({ id: r.id, name: r.name, role: r.role, dept: r.dept, bio: r.bio, photo: r.photo, linkedin: r.linkedin, girl: r.girl }));
}
