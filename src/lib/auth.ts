import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isCompanyEmail } from "@/lib/admin-access";
import { db, hasDb } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "@/lib/session-token";

export async function createSession(userId: string, maxAge = SESSION_MAX_AGE) {
  const token = await signSession(userId, maxAge);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Current admin (validated against the DB, so deleting a user revokes their session) or null. */
export const getAdmin = cache(async () => {
  // Read cookies first, always: this is what makes every admin page dynamic (never prerendered at build).
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!hasDb) return null;
  let userId: string | null;
  try {
    userId = await verifySession(token);
  } catch {
    return null; // SESSION_SECRET missing -> treated as logged out
  }
  if (!userId) return null;
  const user = await db.adminUser.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
  return user && isCompanyEmail(user.email) ? user : null; // a login that is not of the company domain does not work
});

/** Call at the top of every admin page AND every admin server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
