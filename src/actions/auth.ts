"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ADMIN_DOMAIN, isCompanyEmail } from "@/lib/admin-access";
import { alertFailure, alertLater } from "@/lib/alerts";
import { createSession, destroySession, sessionVersion } from "@/lib/auth";
import { db, hasDb } from "@/lib/db";
import { isLimited, rateLimit, resetLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import { safeAdminNext } from "@/lib/safe-next";
import { REMEMBER_MAX_AGE, SESSION_MAX_AGE } from "@/lib/session-token";

export type LoginState = { error?: string };

const credentials = z.object({ email: z.email().max(200), password: z.string().min(1).max(200) });

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
let dummyHash: string | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 10, 15 * 60_000)) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  const parsed = credentials.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };
  if (!isCompanyEmail(parsed.data.email)) return { error: `Please sign in with your @${ADMIN_DOMAIN} email address.` };
  if (!hasDb || !process.env.SESSION_SECRET) return { error: "Server is not configured yet (DATABASE_URL / SESSION_SECRET)." };
  // 5 wrong passwords for one account = that account is locked for 15 minutes (counted for every typed address, so it tells nothing about who exists)
  const emailKey = `login-email:${parsed.data.email}`;
  if (isLimited(emailKey, 5, 15 * 60_000)) return { error: "This account is locked for 15 minutes after too many wrong passwords." };

  try {
    const user = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
    dummyHash ??= bcrypt.hashSync("not-a-real-password", 12);
    const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? dummyHash);
    if (!user || !valid) {
      rateLimit(emailKey, 5, 15 * 60_000);
      return { error: "Invalid email or password." };
    }
    resetLimit(emailKey);
    await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await createSession(user.id, formData.get("remember") ? REMEMBER_MAX_AGE : SESSION_MAX_AGE, sessionVersion(user.passwordHash));
    // every sign-in reaches the owner's WhatsApp, so a stranger's login is seen at once (ALERT_LOGINS=off turns it off)
    if (process.env.ALERT_LOGINS !== "off") alertLater({ level: "info", kind: "login", title: `Admin signed in: ${user.email}`, ip, notify: true });
  } catch (error) {
    console.error("login failed", error);
    alertFailure("Admin login", error);
    return { error: "Something went wrong. Please try again." };
  }
  redirect(safeAdminNext(formData.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
