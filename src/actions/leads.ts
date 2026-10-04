"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db, hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

export type LeadState = { status: "idle" | "success" | "error"; message?: string };

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email.").max(200),
  phone: z.string().trim().max(30).default(""),
  message: z.string().trim().min(10, "Please write a few more words (10+ characters).").max(2000),
});

/** Public contact form. Spam protection: hidden honeypot field + 5 messages per IP per hour. */
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  if (formData.get("website")) return { status: "success", message: "Thank you! We will contact you soon." }; // bot filled the honeypot

  if (!rateLimit(`lead:${await clientIp()}`, 5, 60 * 60_000)) {
    return { status: "error", message: "Too many messages. Please try again later." };
  }
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    message: formData.get("message"),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  if (!hasDb) return { status: "error", message: "The form is not available right now. Please email us instead." };

  try {
    await db.lead.create({ data: parsed.data });
    return { status: "success", message: "Thank you! We will contact you soon." };
  } catch (error) {
    console.error("submitLead failed", error);
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
