// Which screens each admin may open (RBAC), as plain data + pure functions (no database here, so it is easy to test).
// The rights of the team member are stored in the table Setting under the key "admin-access" as { grants: { "parth@we3vision.com": ["blog", "leads"] } },
// so no migration is needed (lib/admin-permissions.ts reads and writes it). The two master admins have no row: they always have everything.
import { ADMIN_AREAS, isAdminArea, type AdminArea } from "@/components/admin/admin-menu";
import { ADMIN_EMAILS, isAllowedAccount, isMasterEmail } from "@/lib/admin-access";

export const ACCESS_SETTING_KEY = "admin-access";

/** e-mail -> the screens that person may open */
export type Grants = Record<string, AdminArea[]>;

/** What one signed-in admin may do. */
export type Access = {
  /** a master admin (Admin@ or Harsh@): every screen + Admin access, and cannot be removed */
  isSuper: boolean;
  /** the screens this admin may open (all of them for a master admin) */
  areas: AdminArea[];
};

const ALL_AREAS = ADMIN_AREAS.map((a) => a.key);

/** A value read from the database, made safe: only the team members (not the master admins), only known screens, each once, in menu order. */
export function cleanGrants(value: unknown): Grants {
  const raw = (value && typeof value === "object" ? (value as { grants?: unknown }).grants : null) as Record<string, unknown> | null;
  const out: Grants = {};
  if (!raw || typeof raw !== "object") return out;
  for (const email of ADMIN_EMAILS) {
    if (isMasterEmail(email)) continue;
    const list = raw[email];
    const wanted = new Set(Array.isArray(list) ? list.filter(isAdminArea) : []);
    out[email] = ALL_AREAS.filter((a) => wanted.has(a));
  }
  return out;
}

/**
 * The rights of an account.
 *  - not one of the three accounts: nothing at all
 *  - Admin@ and Harsh@ (master admins): everything, always
 *  - Parth@: only the screens a master admin gave him in Admin access
 */
export function resolveAccess(email: string, grants: Grants): Access {
  const e = email.trim().toLowerCase();
  if (!isAllowedAccount(e)) return { isSuper: false, areas: [] };
  if (isMasterEmail(e)) return { isSuper: true, areas: ALL_AREAS };
  return { isSuper: false, areas: grants[e] ?? [] };
}

/** May this admin open this screen? */
export const canOpen = (access: Pick<Access, "isSuper" | "areas">, area: AdminArea) => access.isSuper || access.areas.includes(area);
