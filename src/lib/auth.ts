import "server-only";
import { createHash } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminArea } from "@/components/admin/admin-menu";
import { isAllowedAccount, isMasterEmail } from "@/lib/admin-access";
import { canOpen, resolveAccess, type Access } from "@/lib/admin-grants";
import { readGrants } from "@/lib/admin-permissions";
import { db, hasDb } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE, readSession, signSession } from "@/lib/session-token";

/** A short fingerprint of the password hash, kept in the login cookie: when the password changes, every old login stops working. */
export const sessionVersion = (passwordHash: string) => createHash("sha256").update(passwordHash).digest("base64url").slice(0, 16);

export async function createSession(userId: string, maxAge = SESSION_MAX_AGE, ver = "") {
  const token = await signSession(userId, maxAge, ver);
  // A "Secure" cookie is thrown away by Chrome when the page is opened over plain http on a local/LAN address (a production build tried on
  // 192.168.x.x or 127.0.0.1): the login then looked like it did nothing. On the real https site the cookie is Secure as before.
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0].trim();
  const plainHttp = h.get("x-forwarded-proto")?.split(",")[0].trim() === "http" || /^(?:localhost|127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|\[?::1)/i.test(host);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !plainHttp,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in admin and what they may open (see lib/admin-grants.ts). */
export type AdminSession = { id: string; email: string; name: string } & Access;

/** Current admin (validated against the DB, so deleting a user revokes their session) or null. */
export const getAdmin = cache(async (): Promise<AdminSession | null> => {
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
  // only the three company accounts work (a row of any other e-mail is ignored); a login made before the last password change does not work either
  if (!user || !isAllowedAccount(user.email) || session.v !== sessionVersion(user.passwordHash)) return null;
  // the rights are read on every request, so a change in Admin access works at once (no new login needed)
  const grants = isMasterEmail(user.email) ? {} : await readGrants();
  return { id: user.id, email: user.email.toLowerCase(), name: user.name, ...resolveAccess(user.email, grants) };
});

/** Call at the top of every admin page AND every admin server action that needs no special right (the dashboard, uploads…). */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Call at the top of every admin page AND every server action of one screen: signed in AND allowed to open that screen (else back to the dashboard). */
export async function requireArea(area: AdminArea) {
  const admin = await requireAdmin();
  if (!canOpen(admin, area)) redirect(`/admin?denied=${area}`);
  return admin;
}

/** Admin access (the accounts, passwords and the rights of the team member): only a master admin (Admin@ or Harsh@). */
export async function requireSuperAdmin() {
  const admin = await requireAdmin();
  if (!admin.isSuper) redirect("/admin?denied=access");
  return admin;
}
