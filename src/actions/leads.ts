"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { alertFailure, notifyNewLead } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { db, hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { cleanLeadName, leadPhone, leadProblems } from "@/lib/contact-validation";
import { clientIp } from "@/lib/request";

export type LeadState = { status: "idle" | "success" | "error"; message?: string };


/** Public contact form. Spam protection: hidden honeypot field + 5 messages per IP per hour. */
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  if (formData.get("website")) return { status: "success", message: "Thank you! We will contact you soon." }; // bot filled the honeypot

  if (!rateLimit(`lead:${await clientIp()}`, 5, 60 * 60_000)) {
    return { status: "error", message: "Too many messages. Please try again later." };
  }
  const str = (k: string, max: number) => (typeof formData.get(k) === "string" ? String(formData.get(k)).slice(0, max) : "");
  const input = { name: str("name", 200), email: str("email", 300).trim(), phone: str("phone", 40), message: str("message", 3000) };
  // the same rules as the form (lib/contact-validation.ts); a form that asks for the phone sends phoneRequired=1
  const problems = leadProblems(input, { phoneRequired: formData.get("phoneRequired") === "1" });
  const first = (["name", "email", "phone", "message"] as const).map((k) => problems[k]).find(Boolean);
  if (first) return { status: "error", message: first };
  const phone = input.phone.trim() ? (() => { const p = leadPhone(input.phone); return p.ok ? p.value : ""; })() : "";
  const parsed = { success: true as const, data: { name: cleanLeadName(input.name), email: input.email.toLowerCase(), phone, message: input.message.trim().slice(0, 2000) } };
  if (!hasDb) return { status: "error", message: "The form is not available right now. Please email us instead." };

  try {
    await db.lead.create({ data: parsed.data });
    after(() => notifyNewLead(parsed.data));
    return { status: "success", message: "Thank you! We will contact you soon." };
  } catch (error) {
    console.error("submitLead failed", error);
    const { name, email, phone, message } = parsed.data;
    alertFailure("Saving a contact message", error, "critical", `${name} <${email}> ${phone}\n${message.slice(0, 300)}`);
    return { status: "error", message: "Something went wrong. Please try again or email us." };
  }
}

export async function markLeadRead(formData: FormData) {
  await requireAdmin();
  await db.lead.update({ where: { id: String(formData.get("id")) }, data: { isRead: true } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(formData: FormData) {
  await requireAdmin();
  await db.lead.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
