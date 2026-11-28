import "server-only";
import { ADMIN_DOMAIN } from "@/lib/admin-access";
import { db } from "@/lib/db";

/**
 * The people an application can be "looked after by": every login of the admin panel (company e-mails only), oldest first.
 * Oldest first keeps each person's colour on the hiring board when somebody new is added (the new person gets the next colour).
 */
export async function listAdmins() {
  return db.adminUser.findMany({ where: { email: { endsWith: `@${ADMIN_DOMAIN}`, mode: "insensitive" } }, orderBy: { createdAt: "asc" }, select: { id: true, name: true } });
}
