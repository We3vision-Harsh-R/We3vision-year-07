"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/auth";
import { db, hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

export type LoginState = { error?: string };

const credentials = z.object({ email: z.email().max(200), password: z.string().min(1).max(200) });

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
let dummyHash: string | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!rateLimit(`login:${await clientIp()}`, 10, 15 * 60_000)) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  const parsed = credentials.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };
  if (!hasDb || !process.env.SESSION_SECRET) return { error: "Server is not configured yet (DATABASE_URL / SESSION_SECRET)." };

  try {
    const user = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
    dummyHash ??= bcrypt.hashSync("not-a-real-password", 12);
    const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? dummyHash);
    if (!user || !valid) return { error: "Invalid email or password." };
    await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await createSession(user.id);
  } catch (error) {
    console.error("login failed", error);
    return { error: "Something went wrong. Please try again." };
  }
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
