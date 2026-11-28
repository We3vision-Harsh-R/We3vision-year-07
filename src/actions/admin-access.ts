"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ADMIN_ACCOUNTS, LOGIN_SETTING_KEY, cleanLoginImage, isAllowedAccount, isMasterEmail } from "@/lib/admin-access";
import { cleanGrants } from "@/lib/admin-grants";
import { saveGrants } from "@/lib/admin-permissions";
import { alertFailure, alertLater } from "@/lib/alerts";
import { createSession, requireSuperAdmin, sessionVersion } from "@/lib/auth";
import { SESSION_MAX_AGE } from "@/lib/session-token";
import { db } from "@/lib/db";
import type { ActionResult } from "./types";

// Admin access: only a master admin (Admin@ or Harsh@) may use any of these (requireSuperAdmin). The panel has exactly three accounts (lib/admin-access.ts).

const passwordRule = z.string().min(12, "The password needs at least 12 characters.").max(200);

/** The picture on the right of the login page. An empty value goes back to the default picture. */
export async function saveLoginImage(input: unknown): Promise<ActionResult> {
  await requireSuperAdmin();
  const raw = typeof input === "string" ? input.trim() : "";
  const image = cleanLoginImage(raw);
  if (raw && !image) return { ok: false, error: "That picture address is not allowed. Upload a picture, or use /images/… or https://…" };
  try {
    await db.setting.upsert({ where: { key: LOGIN_SETTING_KEY }, create: { key: LOGIN_SETTING_KEY, value: { image } }, update: { value: { image } } });
    revalidatePath("/admin/login");
    return { ok: true, message: image ? "The login page picture is updated." : "The login page has its original picture again." };
  } catch (error) {
    console.error("saveLoginImage failed", error);
    alertFailure("Saving the login page picture (admin)", error, "warning");
    return { ok: false, error: "Could not save the picture. Please try again." };
  }
}

/** Creates the login of one of the three accounts (the name comes from the list in lib/admin-access.ts). Any other e-mail address is refused. */
export async function createAdminUser(input: { email?: unknown; password?: unknown }): Promise<ActionResult> {
  const me = await requireSuperAdmin();
  const email = String(input.email ?? "").trim().toLowerCase();
  const account = ADMIN_ACCOUNTS.find((a) => a.email === email);
  if (!account) return { ok: false, error: "The admin panel has only three accounts. This e-mail address is not one of them." };
  const password = passwordRule.safeParse(input.password);
  if (!password.success) return { ok: false, error: password.error.issues[0].message };
  try {
    if (await db.adminUser.findUnique({ where: { email } })) return { ok: false, error: "This account already exists." };
    await db.adminUser.create({ data: { email, name: account.name, passwordHash: await bcrypt.hash(password.data, 12) } });
    alertLater({ level: "info", kind: "admin", title: `Admin account created: ${email}`, detail: `Created by ${me.email}`, notify: true });
    revalidatePath("/admin", "layout");
    return { ok: true, message: `${email} can now sign in.` };
  } catch (error) {
    console.error("createAdminUser failed", error);
    alertFailure("Creating an admin account", error, "warning");
    return { ok: false, error: "Could not create the account. Please try again." };
  }
}

/** A new password for one of the three accounts (the old one stops working). */
export async function setAdminPassword(id: string, password: unknown): Promise<ActionResult> {
  const me = await requireSuperAdmin();
  const parsed = passwordRule.safeParse(password);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  try {
    const target = await db.adminUser.findUnique({ where: { id }, select: { email: true } });
    if (!target || !isAllowedAccount(target.email)) return { ok: false, error: "That account cannot sign in, so it has no password to change." };
    const passwordHash = await bcrypt.hash(parsed.data, 12);
    const user = await db.adminUser.update({ where: { id }, data: { passwordHash }, select: { email: true } });
    // every device of this user is logged out now; the one who changed their own password stays signed in here
    if (id === me.id) await createSession(me.id, SESSION_MAX_AGE, sessionVersion(passwordHash));
    alertLater({ level: "info", kind: "admin", title: `Admin password changed: ${user.email}`, detail: `Changed by ${me.email}`, notify: true });
    return { ok: true, message: "The password is changed." };
  } catch (error) {
    console.error("setAdminPassword failed", error);
    alertFailure("Changing an admin password", error, "warning");
    return { ok: false, error: "Could not change the password. Please try again." };
  }
}

/** Removes a login (it stops working at once). Never a master admin (Admin@ or Harsh@: nobody can remove them, not even each other), and not yourself. Also removes a leftover row of an e-mail that is not one of the three. */
export async function deleteAdminUser(id: string): Promise<ActionResult> {
  const me = await requireSuperAdmin();
  if (me.id === id) return { ok: false, error: "You cannot remove the user you are signed in with." };
  try {
    const target = await db.adminUser.findUnique({ where: { id }, select: { email: true } });
    if (!target) return { ok: false, error: "That user does not exist any more." };
    if (isMasterEmail(target.email)) return { ok: false, error: "The two master admins (Admin@ and Harsh@) cannot be removed by anybody." };
    if ((await db.adminUser.count()) <= 1) return { ok: false, error: "The last user cannot be removed." };
    await db.adminUser.delete({ where: { id } });
    alertLater({ level: "info", kind: "admin", title: `Admin user removed: ${target.email}`, detail: `Removed by ${me.email}`, notify: true });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "The user is removed." };
  } catch (error) {
    console.error("deleteAdminUser failed", error);
    alertFailure("Removing an admin user", error, "warning");
    return { ok: false, error: "Could not remove the user. Please try again." };
  }
}

/** Which screens Harsh and Parth may open. `grants` = { "harsh@we3vision.com": ["blog", "leads"], ... }; anything unknown is dropped. Works at their next click. */
export async function saveAdminAccess(input: { grants?: unknown }): Promise<ActionResult> {
  const me = await requireSuperAdmin();
  try {
    const grants = cleanGrants({ grants: input?.grants });
    await saveGrants(grants);
    const summary = Object.entries(grants)
      .map(([email, areas]) => `${email.split("@")[0]}: ${areas.length}`)
      .join(", ");
    alertLater({ level: "info", kind: "admin", title: "Admin access changed", detail: `By ${me.email} (screens given: ${summary})`, notify: true });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Saved. The new access works from the next click of each person." };
  } catch (error) {
    console.error("saveAdminAccess failed", error);
    alertFailure("Saving the admin access list", error, "warning");
    return { ok: false, error: "Could not save the access list. Please try again." };
  }
}
