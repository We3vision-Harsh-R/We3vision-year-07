"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { COMMON_FIELDS } from "@/lib/careers-shared";
import { alertFailure, notifyNewApplication } from "@/lib/alerts";
import { db, hasDb } from "@/lib/db";
import { fieldProblem, isValidEmail, isValidPhone } from "@/lib/contact-validation";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import type { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "./types";

// ---------------------------------------------------------------------------------------------------------------------------------
// The visitor (Careers page): book the seat (the city is the only thing that must be there), then give the passenger details.
// ---------------------------------------------------------------------------------------------------------------------------------

const line = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");
const para = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export type BookInput = {
  id?: string;
  city?: unknown;
  currentStatus?: unknown;
  roleId?: unknown;
  joinDate?: unknown;
  noticePeriod?: unknown;
  callSlot?: unknown;
  resume?: unknown;
};

/** "Book your seat": creates the ticket (or updates it when the visitor changes their mind). Only the city is needed. */
export async function bookSeat(input: BookInput): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!hasDb) return { ok: false, error: "Booking is not available right now. Please email hr@we3vision.com." };
  if (!rateLimit(`career-book:${await clientIp()}`, 12, 60 * 60_000)) return { ok: false, error: "Too many tries. Please wait a little and try again." };
  const city = line(input.city, 120);
  if (!city) return { ok: false, error: "Please choose your location first." };
  const resume = typeof input.resume === "string" && /^\/media\/[a-z0-9]{10,40}$/i.test(input.resume) ? input.resume : "";
  const joinDate = typeof input.joinDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.joinDate) ? input.joinDate : "";
  try {
    let roleTitle = "";
    let roleId = "";
    if (typeof input.roleId === "string" && /^[a-z0-9]{10,40}$/i.test(input.roleId)) {
      const role = await db.careerRole.findUnique({ where: { id: input.roleId }, select: { id: true, title: true } });
      if (role) {
        roleId = role.id;
        roleTitle = role.title;
      }
    }
    const data = { city, currentStatus: line(input.currentStatus, 80), roleId, roleTitle, joinDate, noticePeriod: line(input.noticePeriod, 40), callSlot: line(input.callSlot, 60), resume };
    if (typeof input.id === "string" && /^[a-z0-9]{10,40}$/i.test(input.id)) {
      const hit = await db.careerApplication.updateMany({ where: { id: input.id, stage: "booked" }, data });
      if (hit.count > 0) return { ok: true, id: input.id };
    }
    const row = await db.careerApplication.create({ data, select: { id: true } });
    revalidatePath("/admin/careers");
    return { ok: true, id: row.id };
  } catch (error) {
    console.error("bookSeat failed", error);
    alertFailure("Booking a Careers seat", error, "critical");
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export type PassengerInput = {
  id: string;
  fields: Record<string, unknown>;
  custom: Record<string, unknown>;
  website?: unknown;
};

const emailRule = z.email().max(200);

/** The passenger details after the seat is booked. The usual questions are fixed; the extra ones come from the admin panel. */
export async function completeTicket(input: PassengerInput): Promise<ActionResult> {
  if (input.website) return { ok: true, message: "Your ticket is ready." }; // a bot filled the hidden field
  if (!hasDb) return { ok: false, error: "Booking is not available right now. Please email hr@we3vision.com." };
  if (!rateLimit(`career-done:${await clientIp()}`, 8, 60 * 60_000)) return { ok: false, error: "Too many tries. Please wait a little and try again." };
  if (typeof input.id !== "string" || !/^[a-z0-9]{10,40}$/i.test(input.id)) return { ok: false, error: "Please book your seat first." };

  const f = (k: string, max = 300) => line(input.fields?.[k], max);
  const name = f("name", 100);
  const email = f("email", 200).toLowerCase();
  const phone = f("phone", 30);
  const skills = para(input.fields?.skills, 800);
  if (name.length < 2) return { ok: false, error: "Please enter your full name." };
  if (!emailRule.safeParse(email).success || !isValidEmail(email)) return { ok: false, error: "Please enter a valid email, like name@example.com." };
  if (!isValidPhone(phone)) return { ok: false, error: "Please enter a valid phone number: 7 to 15 digits, for example +91 98765 43210." };
  if (skills.length < 2) return { ok: false, error: "Please tell us your skills." };
  // the same rules as the form: name, link, experience, salaries and the texts (no < >, no rows of symbols)
  for (const c of COMMON_FIELDS) {
    const bad = fieldProblem(c.key, c.key === "skills" || c.key === "about" ? para(input.fields?.[c.key], 1000) : f(c.key, 300));
    if (bad) return { ok: false, error: `${c.label}: ${bad}` };
  }

  try {
    const questions = await db.careerQuestion.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
    const answers: { q: string; a: string }[] = [];
    for (const c of COMMON_FIELDS) {
      if (c.key === "name" || c.key === "email" || c.key === "phone" || c.key === "linkedin" || c.key === "skills" || c.key === "experience") continue;
      const a = c.kind === "textarea" ? para(input.fields?.[c.key], 1000) : f(c.key, 200);
      if (a) answers.push({ q: c.label, a });
    }
    for (const q of questions) {
      const a = q.kind === "textarea" ? para(input.custom?.[q.id], 1000) : line(input.custom?.[q.id], 300);
      if (q.required && !a) return { ok: false, error: `Please answer: ${q.label}` };
      if (a) answers.push({ q: q.label, a });
    }
    const hit = await db.careerApplication.updateMany({
      where: { id: input.id },
      data: { name, email, phone, linkedin: f("linkedin", 300), skills, experience: f("experience", 80), answers: answers as unknown as Prisma.InputJsonValue, stage: "complete" },
    });
    if (hit.count === 0) return { ok: false, error: "Your ticket was not found. Please book your seat again." };
    const ticket = input.id;
    after(() => notifyNewApplication(ticket));
    revalidatePath("/admin/careers");
    return { ok: true, message: "Your ticket is booked. See you at Surat Junction!" };
  } catch (error) {
    console.error("completeTicket failed", error);
    alertFailure("Saving a Careers ticket", error, "critical", `${name} <${email}> ${phone}`);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------
// The admin panel (Careers)
// ---------------------------------------------------------------------------------------------------------------------------------

export type SetupInput = {
  questions: { id?: string; label?: unknown; kind?: unknown; options?: unknown; required?: unknown; active?: unknown }[];
};

/** The questions of HR: the whole list is saved in the order it has. (The positions are written one by one, see jobs.ts.) */
export async function saveCareerSetup(input: SetupInput): Promise<ActionResult> {
  await requireAdmin();
  const questions = (Array.isArray(input.questions) ? input.questions : [])
    .slice(0, 30)
    .map((q) => {
      const kind = q.kind === "textarea" || q.kind === "select" || q.kind === "yesno" ? q.kind : "text";
      const options = Array.isArray(q.options) ? q.options.map((o) => line(o, 60)).filter(Boolean).slice(0, 12) : [];
      return { label: line(q.label, 200), kind, options, required: q.required === true, active: q.active !== false };
    })
    .filter((q) => q.label && (q.kind !== "select" || q.options.length > 0));
  try {
    await db.$transaction([
      db.careerQuestion.deleteMany({}),
      db.careerQuestion.createMany({ data: questions.map((q, i) => ({ ...q, options: q.options as unknown as Prisma.InputJsonValue, sortOrder: i + 1, updatedAt: new Date() })) }),
    ]);
    revalidatePath("/careers");
    revalidatePath("/admin/careers/setup");
    return { ok: true, message: `Saved: ${questions.length} questions. The Careers page is updated.` };
  } catch (error) {
    console.error("saveCareerSetup failed", error);
    alertFailure("Saving the Careers setup (admin)", error, "warning");
    return { ok: false, error: "Could not save. Please try again." };
  }
}
