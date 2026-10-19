import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { ContentTypeDef, DraftData } from "../types";
import type { McpContext } from "./tokens";

// The submissions an AI tool sent (table ContentSubmission) and their audit log (SubmissionEvent). Used by the MCP tools and by the
// admin panel. A submission is only ever CREATED here as pending_review; going live is done by an admin (publish.ts).

export const STATUSES = ["pending_review", "approved", "rejected", "draft"] as const;
export type SubmissionStatus = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending_review: "Pending approval",
  approved: "Approved and live",
  rejected: "Rejected",
  draft: "Saved as a hidden draft",
};

const actorOf = (ctx: McpContext) => `connection: ${ctx.connectionName} (${ctx.adminEmail})`;

export type CreateResult = { id: string; duplicate: boolean };

/** Saves a validated draft as pending_review. The same title sent twice while it is still waiting returns the first one (a retry is harmless). */
export async function createSubmission(ctx: McpContext, def: ContentTypeDef, data: DraftData): Promise<CreateResult> {
  const title = String(data[def.titleField] ?? "").slice(0, 200);
  const same = await db.contentSubmission.findFirst({
    where: { contentType: def.key, status: "pending_review", title: { equals: title, mode: "insensitive" }, connection: { adminId: ctx.adminId } },
    select: { id: true },
  });
  if (same) return { id: same.id, duplicate: true };
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
