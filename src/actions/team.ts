"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { alertFailure } from "@/lib/alerts";
import { db } from "@/lib/db";
import { cleanPeople } from "@/lib/team-shared";
import type { ActionResult } from "./types";

/** Saves the whole list of people of the office (the order of the list is the order in the office). The Team page is updated at once. */
export async function saveTeam(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const people = cleanPeople(input);
  try {
    await db.$transaction([
      db.teamMember.deleteMany({}),
      db.teamMember.createMany({ data: people.map((p, i) => ({ ...p, sortOrder: i + 1, updatedAt: new Date() })) }),
    ]);
    revalidatePath("/team");
    revalidatePath("/admin/team");
    return { ok: true, message: `Saved. ${people.length} ${people.length === 1 ? "person is" : "people are"} in the office on the live Team page.` };
  } catch (error) {
    console.error("saveTeam failed", error);
    alertFailure("Saving the team (admin)", error, "warning");
    return { ok: false, error: "Could not save the team. Please try again." };
  }
}
