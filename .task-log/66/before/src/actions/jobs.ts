"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { WORK_MODES, WORK_TYPES, slugify } from "@/lib/careers-shared";
import { db, hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import type { Prisma } from "@/generated/prisma/client";
import type { ActionResult } from "./types";

// ---------------------------------------------------------------------------------------------------------------------------------
// The jobs of the Careers page: the visitor applies on the page of a job (/careers/<slug>); the admin panel (Careers > Jobs) writes the jobs.
// ---------------------------------------------------------------------------------------------------------------------------------

const line = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");
const para = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const emailRule = z.email().max(200);
/** today as yyyy-mm-dd in India (a job is open until the end of its closing day) */
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

export type ApplyInput = {
  roleId: string;
  fields: Record<string, unknown>;
  resume?: unknown;
  custom: Record<string, unknown>;
  website?: unknown;
};

/** The apply form on the page of a job: the whole application in one go. */
export async function applyForJob(input: ApplyInput): Promise<ActionResult> {
  if (input.website) return { ok: true, message: "Thank you. Your application is with our HR team." }; // a bot filled the hidden field
  if (!hasDb) return { ok: false, error: "Applications are not available right now. Please email hr@we3vision.com." };
  if (!rateLimit(`career-apply:${await clientIp()}`, 6, 60 * 60_000)) return { ok: false, error: "Too many tries. Please wait a little and try again." };
  if (typeof input.roleId !== "string" || !/^[a-z0-9]{10,40}$/i.test(input.roleId)) return { ok: false, error: "This position was not found." };

  const f = (k: string, max = 300) => line(input.fields?.[k], max);
  const name = f("name", 100);
  const email = f("email", 200).toLowerCase();
  const phone = f("phone", 30);
  const city = f("city", 120);
  const linkedin = f("linkedin", 300);
  const resume = typeof input.resume === "string" && /^\/media\/[a-z0-9]{10,40}$/i.test(input.resume) ? input.resume : "";
  if (name.length < 2) return { ok: false, error: "Please enter your full name." };
  if (!emailRule.safeParse(email).success) return { ok: false, error: "Please enter a valid email." };
  if (phone.replace(/\D/g, "").length < 6) return { ok: false, error: "Please enter your phone number." };
  if (city.length < 2) return { ok: false, error: "Please tell us the city where you live." };
  if (!resume && !linkedin) return { ok: false, error: "Please upload your resume, or add a link to your work." };

  try {
    const role = await db.careerRole.findUnique({ where: { id: input.roleId } });
    if (!role || !role.active || (role.closesAt && role.closesAt < today())) return { ok: false, error: "This position is closed now." };
    const questions = await db.careerQuestion.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
    const answers: { q: string; a: string }[] = [];
    const about = para(input.fields?.about, 1000);
    if (about) answers.push({ q: "Why do you want to join We3vision?", a: about });
    for (const q of questions) {
      const a = q.kind === "textarea" ? para(input.custom?.[q.id], 1000) : line(input.custom?.[q.id], 300);
      if (q.required && !a) return { ok: false, error: `Please answer: ${q.label}` };
      if (a) answers.push({ q: q.label, a });
    }
    await db.careerApplication.create({
      data: {
        city,
        currentStatus: f("currentStatus", 80),
        roleId: role.id,
        roleTitle: role.title,
        noticePeriod: f("noticePeriod", 40),
        resume,
        name,
        email,
        phone,
        linkedin,
        skills: para(input.fields?.skills, 800),
        experience: f("experience", 80),
        answers: answers as unknown as Prisma.InputJsonValue,
        stage: "complete",
        source: "job",
      },
    });
    revalidatePath("/admin/careers");
    return { ok: true, message: "Thank you. Your application is with our HR team." };
  } catch (error) {
    console.error("applyForJob failed", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export type JobInput = {
  id?: string;
  title?: unknown;
  slug?: unknown;
  team?: unknown;
  summary?: unknown;
  description?: unknown;
  responsibilities?: unknown;
  requirements?: unknown;
  perks?: unknown;
  location?: unknown;
  workType?: unknown;
  workMode?: unknown;
  experience?: unknown;
  openings?: unknown;
  salary?: unknown;
  closesAt?: unknown;
  active?: unknown;
  sortOrder?: unknown;
};

/** a text with one item on every line -> a list */
const lines = (v: unknown, max: number, each: number) =>
  (typeof v === "string" ? v.split(/\r?\n/) : Array.isArray(v) ? v : [])
    .map((x) => line(x, each))
    .filter(Boolean)
    .slice(0, max);

/** Writes one job (new or changed). The address of its page comes from the title unless an address is given. */
export async function saveJob(input: JobInput): Promise<ActionResult & { id?: string; slug?: string }> {
  await requireAdmin();
  const title = line(input.title, 100);
  if (title.length < 2) return { ok: false, error: "Please write the name of the position." };
  const workType = WORK_TYPES.find((w) => w === input.workType) ?? "Full-time";
  const workMode = WORK_MODES.find((w) => w === input.workMode) ?? "On-site";
  const closesAt = typeof input.closesAt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.closesAt) ? input.closesAt : "";
  const openings = Math.min(99, Math.max(1, Math.round(Number(input.openings) || 1)));
  const sortOrder = Math.min(9999, Math.max(0, Math.round(Number(input.sortOrder) || 0)));
  const data = {
    title,
    team: line(input.team, 40),
    summary: line(input.summary, 240),
    description: para(input.description, 6000),
    responsibilities: lines(input.responsibilities, 20, 240) as unknown as Prisma.InputJsonValue,
    requirements: lines(input.requirements, 20, 240) as unknown as Prisma.InputJsonValue,
    perks: lines(input.perks, 20, 160) as unknown as Prisma.InputJsonValue,
    location: line(input.location, 80) || "Surat, India",
    workType,
    workMode,
    experience: line(input.experience, 40),
    openings,
    salary: line(input.salary, 60),
    closesAt,
    active: input.active !== false,
  };
  const wanted = slugify(line(input.slug, 80) || title) || "position";
  try {
    // an address that nobody else has
    const own = typeof input.id === "string" && /^[a-z0-9]{10,40}$/i.test(input.id) ? input.id : "";
    let slug = wanted;
    for (let n = 2; n < 50; n++) {
      const other = await db.careerRole.findUnique({ where: { slug }, select: { id: true } });
      if (!other || other.id === own) break;
      slug = `${wanted}-${n}`;
    }
    let id = own;
    if (id) {
      const before = await db.careerRole.findUnique({ where: { id }, select: { slug: true } });
      await db.careerRole.update({ where: { id }, data: { ...data, slug, ...(sortOrder ? { sortOrder } : {}) } });
      if (before && before.slug !== slug) revalidatePath(`/careers/${before.slug}`);
    } else {
      const last = await db.careerRole.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
      const row = await db.careerRole.create({ data: { ...data, slug, sortOrder: sortOrder || (last?.sortOrder ?? 0) + 1 }, select: { id: true } });
      id = row.id;
    }
    revalidatePath("/careers");
    revalidatePath(`/careers/${slug}`);
    revalidatePath("/admin/careers/jobs");
    return { ok: true, message: "Saved. The job is updated on the Careers page.", id, slug };
  } catch (error) {
    console.error("saveJob failed", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

/** Opens or closes a job without losing it. */
export async function setJobOpen(id: string, open: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    const row = await db.careerRole.update({ where: { id }, data: { active: open }, select: { slug: true } });
    revalidatePath("/careers");
    revalidatePath(`/careers/${row.slug}`);
    revalidatePath("/admin/careers/jobs");
    return { ok: true, message: open ? "The job is open." : "The job is closed." };
  } catch {
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function deleteJob(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const row = await db.careerRole.delete({ where: { id }, select: { slug: true } });
    revalidatePath("/careers");
    revalidatePath(`/careers/${row.slug}`);
    revalidatePath("/admin/careers/jobs");
    return { ok: true, message: "The job is removed. The applications that came for it are kept." };
  } catch {
    return { ok: false, error: "Could not remove it. Please try again." };
  }
}
