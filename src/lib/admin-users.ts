import "server-only";
import { ADMIN_EMAILS } from "@/lib/admin-access";
import { db } from "@/lib/db";

/** The people an application can be "looked after by": the accounts of the admin panel that exist in the database, in name order. A row of any other e-mail is never listed. */
export async function listAdmins() {
  return db.adminUser.findMany({ where: { email: { in: ADMIN_EMAILS } }, orderBy: { name: "asc" }, select: { id: true, name: true } });
}
