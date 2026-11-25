"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { COMMON_FIELDS, NOTICE_PERIODS, callSlots, cleanSchedule } from "@/lib/careers-shared";
import { getInterviewSchedule } from "@/lib/careers";
import { alertFailure, notifyNewApplication } from "@/lib/alerts";
import { db, hasDb } from "@/lib/db";
import { cityProblem, fieldProblem, isValidEmail, isValidPhone, joinDateProblem, leadPhone, statusProblem } from "@/lib/contact-validation";
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
  // every answer of the seat is checked here too (the page checks the same rules): nothing more than the form can give is stored
  const city = line(input.city, 120);
  const cityBad = cityProblem(city);
  if (cityBad) return { ok: false, error: cityBad };
  const currentStatus = line(input.currentStatus, 80);
  const statusBad = statusProblem(currentStatus);
  if (statusBad) return { ok: false, error: `Current career status: ${statusBad}` };
  const joinDate = typeof input.joinDate === "string" ? input.joinDate : "";
  const dateBad = joinDateProblem(joinDate);
  if (dateBad) return { ok: false, error: `When can you join: ${dateBad}` };
  const noticePeriod = line(input.noticePeriod, 40);
  if (noticePeriod && !NOTICE_PERIODS.includes(noticePeriod)) return { ok: false, error: "Arrival time: please choose one of the options." };
  const callSlot = line(input.callSlot, 60);
  const schedule = callSlot ? await getInterviewSchedule() : null;
  if (callSlot && schedule && !callSlots(new Date(Date.now() - 86_400_000), { ...schedule, daysAhead: schedule.daysAhead + 2 }).some((d) => d.times.some((t) => `${d.label}, ${t}` === callSlot))) return { ok: false, error: "Interview slot: please choose a slot from the calendar." };
  if (input.resume && !(typeof input.resume === "string" && /^\/media\/[a-z0-9]{10,40}$/i.test(input.resume))) return { ok: false, error: "Please upload your resume again." };
  const resume = typeof input.resume === "string" ? input.resume : "";
  try {
    let roleTitle = "";
    let roleId = "";
    if (input.roleId) {
      const role = typeof input.roleId === "string" && /^[a-z0-9]{10,40}$/i.test(input.roleId) ? await db.careerRole.findUnique({ where: { id: input.roleId }, select: { id: true, title: true } }) : null;
      if (!role) return { ok: false, error: "Your destination: please choose an open position from the list." };
      roleId = role.id;
      roleTitle = role.title;
    }
    // one candidate per interview slot (a rejected or withdrawn application gives its slot back)
    if (callSlot) {
      const own = typeof input.id === "string" && /^[a-z0-9]{10,40}$/i.test(input.id) ? input.id : "";
      const taken = await db.careerApplication.count({ where: { callSlot, status: { not: "rejected" }, ...(own ? { NOT: { id: own } } : {}) } });
      if (taken > 0) return { ok: false, error: "This interview slot has just been taken. Please choose another one." };
    }
    const data = { city, currentStatus, roleId, roleTitle, joinDate, noticePeriod, callSlot, resume };
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
  if (!isValidPhone(phone)) { const p = leadPhone(phone); return { ok: false, error: p.ok ? "Please enter a valid phone number." : p.problem }; }
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

/** The interview slots that are already booked ("Wed, 26 Nov, 11:00 – 12:00"), so that the calendar can show them as full. Names are never sent. */
export async function takenSlots(): Promise<string[]> {
  if (!hasDb) return [];
  try {
    const rows = await db.careerApplication.findMany({ where: { callSlot: { not: "" }, status: { not: "rejected" } }, select: { callSlot: true }, take: 2000 });
    return [...new Set(rows.map((r) => r.callSlot))];
  } catch {
    return [];
  }
}

/** Admin > Careers > Interview schedule: the days and windows that candidates can book. */
export async function saveInterviewSchedule(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const schedule = cleanSchedule(input);
  try {
    const value = schedule as unknown as Prisma.InputJsonValue;
    await db.setting.upsert({ where: { key: "careers:schedule" }, update: { value }, create: { key: "careers:schedule", value } });
    revalidatePath("/careers");
    revalidatePath("/m/careers");
    revalidatePath("/admin/careers/interviews");
    return { ok: true, message: "Saved. The calendar on the Careers page is updated." };
  } catch (error) {
    console.error("saveInterviewSchedule failed", error);
    alertFailure("Saving the interview schedule (admin)", error, "warning");
    return { ok: false, error: "Could not save. Please try again." };
  }
}
