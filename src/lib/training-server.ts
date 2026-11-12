import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { db, hasDb } from "@/lib/db";
import { DEFAULT_COURSES, cleanCourses, type Course } from "@/lib/training-shared";

// The courses of the Industrial Training pages, saved in the Setting table (key "training"). Without a saved list (or without a database) the starting list is used.
const KEY = "training";

export async function getCourses(): Promise<Course[]> {
  if (!hasDb) return DEFAULT_COURSES;
  try {
    const row = await db.setting.findUnique({ where: { key: KEY } });
    if (!row) return DEFAULT_COURSES;
    const v = row.value as { courses?: unknown } | null;
    return Array.isArray(v?.courses) ? cleanCourses(v.courses) : DEFAULT_COURSES;
  } catch {
    return DEFAULT_COURSES;
  }
}

export async function saveCourses(input: unknown): Promise<Course[]> {
  const courses = cleanCourses(input);
  const value = { v: 1, courses } as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({ where: { key: KEY }, update: { value }, create: { key: KEY, value } });
  return courses;
}
