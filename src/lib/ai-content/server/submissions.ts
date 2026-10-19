import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { ContentTypeDef, DraftData } from "../types";
import type { McpContext } from "./tokens";

// The submissions an AI tool sent (table ContentSubmission) and their audit log (SubmissionEvent). Used by the MCP tools and by the
// admin panel. A submission is only ever CREATED here as pending_review; going live is done by an admin (publish.ts).

export const STATUSES = ["pending_review", "approved", "rejected", "draft"] as const;
/** "publishing" is held for a moment while an admin approves it (so a double click cannot publish twice). */
export type SubmissionStatus = (typeof STATUSES)[number] | "publishing";

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending_review: "Pending approval",
  approved: "Approved and live",
  rejected: "Rejected",
  draft: "Saved as a hidden draft",
  publishing: "Publishing…",
};

const actorOf = (ctx: McpContext) => `connection: ${ctx.connectionName} (${ctx.adminEmail})`;

/** At most this many drafts of one admin wait at the same time (a runaway AI tool cannot flood the approval queue). */
export const MAX_PENDING = 30;

export type CreateResult = { id: string; duplicate: boolean } | { full: true };

/** Saves a validated draft as pending_review. The same title sent twice while it is still waiting returns the first one (a retry is harmless). */
export async function createSubmission(ctx: McpContext, def: ContentTypeDef, data: DraftData): Promise<CreateResult> {
  const title = String(data[def.titleField] ?? "").slice(0, 200);
  const same = await db.contentSubmission.findFirst({
    where: { contentType: def.key, status: "pending_review", title: { equals: title, mode: "insensitive" }, connection: { adminId: ctx.adminId } },
    select: { id: true },
  });
  if (same) return { id: same.id, duplicate: true };
  const waiting = await db.contentSubmission.count({ where: { status: "pending_review", connection: { adminId: ctx.adminId } } });
  if (waiting >= MAX_PENDING) return { full: true };
  const row = await db.contentSubmission.create({
    data: {
      contentType: def.key,
      title,
      data: data as Prisma.InputJsonValue,
      status: "pending_review",
      connectionId: ctx.connectionId,
      connectionName: ctx.connectionName,
      events: { create: { action: "submitted", actor: actorOf(ctx) } },
    },
    select: { id: true },
  });
  return { id: row.id, duplicate: false };
}

const publicFields = {
  id: true,
  contentType: true,
  title: true,
  status: true,
  rejectReason: true,
  entitySlug: true,
  createdAt: true,
  reviewedAt: true,
} as const;

/** Submissions of the admin who owns the connection (all their connections), newest first. */
export function listOwnSubmissions(adminId: string, status: SubmissionStatus | undefined, limit: number) {
  return db.contentSubmission.findMany({
    where: { connection: { adminId }, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: publicFields,
  });
}

export function getOwnSubmission(adminId: string, id: string) {
  return db.contentSubmission.findFirst({ where: { id, connection: { adminId } }, select: publicFields });
}

/** How many are waiting (the badge in the admin menu). 0 when the tables are not there yet, so the admin panel never breaks. */
export async function countPending(): Promise<number> {
  try {
    return await db.contentSubmission.count({ where: { status: "pending_review" } });
  } catch {
    return 0;
  }
}
