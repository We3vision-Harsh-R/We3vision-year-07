"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ADMIN_DOMAIN, LOGIN_SETTING_KEY, cleanLoginImage, isCompanyEmail } from "@/lib/admin-access";
import { alertFailure, alertLater } from "@/lib/alerts";
import { createSession, requireAdmin, sessionVersion } from "@/lib/auth";
import { SESSION_MAX_AGE } from "@/lib/session-token";
import { db } from "@/lib/db";
import type { ActionResult } from "./types";

const passwordRule = z.string().min(12, "The password needs at least 12 characters.").max(200);
const nameRule = z.string().trim().min(1, "Enter a name.").max(80);

/** The picture on the right of the login page. An empty value goes back to the default picture. */
export async function saveLoginImage(input: unknown): Promise<ActionResult> {
  await requireAdmin();
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

/** Adds an admin user. Only e-mail addresses of the company domain are accepted. */
export async function createAdminUser(input: { name?: unknown; email?: unknown; password?: unknown }): Promise<ActionResult> {
  const me = await requireAdmin();
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!isCompanyEmail(email)) return { ok: false, error: `Only an e-mail address ending in @${ADMIN_DOMAIN} can be added.` };
  const name = nameRule.safeParse(input.name);
  if (!name.success) return { ok: false, error: name.error.issues[0].message };
  const password = passwordRule.safeParse(input.password);
  if (!password.success) return { ok: false, error: password.error.issues[0].message };
  try {
    if (await db.adminUser.findUnique({ where: { email } })) return { ok: false, error: "There is already a user with this e-mail address." };
    await db.adminUser.create({ data: { email, name: name.data, passwordHash: await bcrypt.hash(password.data, 12) } });
    alertLater({ level: "info", kind: "admin", title: `New admin user: ${email}`, detail: `Added by ${me.email}`, notify: true });
    revalidatePath("/admin/access");
    return { ok: true, message: `${email} can now sign in.` };
  } catch (error) {
    console.error("createAdminUser failed", error);
    alertFailure("Adding an admin user", error, "warning");
    return { ok: false, error: "Could not add the user. Please try again." };
  }
}

/** A new password for a user (the old one stops working). */
export async function setAdminPassword(id: string, password: unknown): Promise<ActionResult> {
  const me = await requireAdmin();
  const parsed = passwordRule.safeParse(password);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  try {
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

/** Removes an admin user (their login stops working at once). You cannot remove yourself, and the last user cannot be removed. */
export async function deleteAdminUser(id: string): Promise<ActionResult> {
  const me = await requireAdmin();
  if (me.id === id) return { ok: false, error: "You cannot remove the user you are signed in with." };
  try {
    if ((await db.adminUser.count()) <= 1) return { ok: false, error: "The last user cannot be removed." };
    const gone = await db.adminUser.delete({ where: { id }, select: { email: true } });
    alertLater({ level: "info", kind: "admin", title: `Admin user removed: ${gone.email}`, detail: `Removed by ${me.email}`, notify: true });
    revalidatePath("/admin/access");
    return { ok: true, message: "The user is removed." };
  } catch (error) {
    console.error("deleteAdminUser failed", error);
    alertFailure("Removing an admin user", error, "warning");
    return { ok: false, error: "Could not remove the user. Please try again." };
  }
}
