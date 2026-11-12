"use server";

import { revalidatePath } from "next/cache";
import { alertFailure } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { saveCourses } from "@/lib/training-server";
import type { ActionResult } from "./types";

/** Admin > Industrial Training: saves the courses and their fees; the three training pages show them at once */
export async function saveTraining(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  try {
    const courses = await saveCourses(input);
    for (const m of ["3-month", "6-month", "9-month"]) revalidatePath("/industrial-training/" + m);
    revalidatePath("/admin/industrial-training");
    return { ok: true, message: courses.length + " course" + (courses.length === 1 ? "" : "s") + " saved. The training pages show them now." };
  } catch (error) {
    console.error("saveTraining failed", error);
    alertFailure("Saving the industrial training courses (admin)", error, "warning");
    return { ok: false, error: "Could not save. Please try again." };
  }
}
