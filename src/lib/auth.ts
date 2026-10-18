import "server-only";
import { createHash } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isCompanyEmail } from "@/lib/admin-access";
import { db, hasDb } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE, readSession, signSession } from "@/lib/session-token";

/** A short fingerprint of the password hash, kept in the login cookie: when the password changes, every old login stops working. */
export const sessionVersion = (passwordHash: string) => createHash("sha256").update(passwordHash).digest("base64url").slice(0, 16);

export async function createSession(userId: string, maxAge = SESSION_MAX_AGE, ver = "") {
  const token = await signSession(userId, maxAge, ver);
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
  let session: { userId: string; v: string } | null;
  try {
    session = await readSession(token);
  } catch {
    return null; // SESSION_SECRET missing -> treated as logged out
  }
  if (!session) return null;
  const user = await db.adminUser.findUnique({ where: { id: session.userId }, select: { id: true, email: true, name: true, passwordHash: true } });
  // a login that is not of the company domain does not work; a login made before the last password change does not work either
  if (!user || !isCompanyEmail(user.email) || session.v !== sessionVersion(user.passwordHash)) return null;
  return { id: user.id, email: user.email, name: user.name };
});

/** Call at the top of every admin page AND every admin server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
