// Which screens each admin may open (RBAC), as plain data + pure functions (no database here, so it is easy to test).
// The rights of the team members are stored in the table Setting under the key "admin-access" as { grants: { "someone@we3vision.com": ["blog", "leads"] } },
// so no migration is needed (lib/admin-permissions.ts reads and writes it). The master admins have no row: they always have everything.
import { ADMIN_AREAS, isAdminArea, type AdminArea } from "@/components/admin/admin-menu";
import { isCompanyEmail, isMasterEmail } from "@/lib/admin-access";

export const ACCESS_SETTING_KEY = "admin-access";

/** e-mail -> the screens that person may open */
export type Grants = Record<string, AdminArea[]>;

/** What one signed-in admin may do. */
export type Access = {
  /** a master admin (Admin@, Harsh@ or Parth@): every screen + Admin access, and cannot be removed */
  isSuper: boolean;
  /** the screens this admin may open (all of them for a master admin) */
  areas: AdminArea[];
};

const ALL_AREAS = ADMIN_AREAS.map((a) => a.key);

/** A value read from the database, made safe: only team members (company e-mails that are not master admins), only known screens, each once, in menu order. */
export function cleanGrants(value: unknown): Grants {
  const raw = (value && typeof value === "object" ? (value as { grants?: unknown }).grants : null) as Record<string, unknown> | null;
  const out: Grants = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [key, list] of Object.entries(raw)) {
    const email = key.trim().toLowerCase();
    if (!isCompanyEmail(email) || isMasterEmail(email)) continue;
    const wanted = new Set(Array.isArray(list) ? list.filter(isAdminArea) : []);
    out[email] = ALL_AREAS.filter((a) => wanted.has(a));
  }
  return out;
}

/**
 * The rights of an account.
 *  - not a company e-mail: nothing at all
 *  - a master admin (Admin@, Harsh@, Parth@): everything, always
 *  - any other login (a team member): only the screens a master admin gave them in Admin access
 */
export function resolveAccess(email: string, grants: Grants): Access {
  const e = email.trim().toLowerCase();
  if (!isCompanyEmail(e)) return { isSuper: false, areas: [] };
  if (isMasterEmail(e)) return { isSuper: true, areas: ALL_AREAS };
  return { isSuper: false, areas: grants[e] ?? [] };
}

/** May this admin open this screen? */
export const canOpen = (access: Pick<Access, "isSuper" | "areas">, area: AdminArea) => access.isSuper || access.areas.includes(area);
