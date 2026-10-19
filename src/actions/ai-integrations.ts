"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { alertFailure, alertLater } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkAuthorize, issueCode, type AuthorizeParams } from "@/lib/ai-content/server/oauth";
import { aiDisabled } from "@/lib/ai-content/server/http";
import { SCOPES, hashToken, hintOf, newToken } from "@/lib/ai-content/server/tokens";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "./types";

// Admin > AI Integrations: the connections of AI tools. Every action first checks that the admin is logged in.

async function origin() {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  if (/^https?:\/\//.test(configured)) return configured;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:1010";
  return `${h.get("x-forwarded-proto") ?? "http"}://${host}`;
}

export type CreateConnectionResult = ActionResult & { token?: string; mcpUrl?: string };

/** Makes a personal access token for tools that connect with a header (Claude Code, Cursor …). The token is shown once; only its hash is kept. */
export async function createConnection(input: { name?: unknown; scopes?: unknown; days?: unknown }): Promise<CreateConnectionResult> {
  const admin = await requireAdmin();
  const name = typeof input.name === "string" ? input.name.replace(/[\u0000-\u001F<>]/g, "").trim().slice(0, 60) : "";
  if (name.length < 2) return { ok: false, error: 'Give the connection a name, for example "Claude laptop".' };
  const scopes = SCOPES.filter((s) => Array.isArray(input.scopes) && input.scopes.includes(s));
  if (scopes.length === 0) return { ok: false, error: "Choose at least one permission." };
  const days = Number(input.days);
  const expiresAt = Number.isFinite(days) && days > 0 ? new Date(Date.now() + Math.min(days, 3650) * 24 * 60 * 60_000) : null;
  if (!rateLimit(`ai-connection:${admin.id}`, 20, 60 * 60_000)) return { ok: false, error: "Too many connections created. Please wait a little." };
  try {
    const token = newToken("pat");
    await db.aiConnection.create({
      data: { name, kind: "token", adminId: admin.id, tokenHash: hashToken(token), tokenHint: hintOf(token), scopes: scopes.join(" "), expiresAt },
    });
    alertLater({ level: "info", kind: "ai", title: `AI connection created: ${name}`, detail: `By ${admin.email}. Permissions: ${scopes.join(", ")}` });
    revalidatePath("/admin/ai-integrations");
    return { ok: true, message: "Connection created. Copy the token now: it is shown only once.", token, mcpUrl: `${await origin()}/api/mcp` };
  } catch (error) {
    console.error("createConnection failed", error);
    alertFailure("Creating an AI connection (admin)", error, "warning");
    return { ok: false, error: "Could not create the connection. Please try again." };
  }
}

/** Stops a connection at once (its tokens do not work from the next request). The record stays for the history. */
export async function revokeConnection(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  try {
    const row = await db.aiConnection.update({ where: { id }, data: { revokedAt: new Date() }, select: { name: true } });
    alertLater({ level: "info", kind: "ai", title: `AI connection revoked: ${row.name}`, detail: `By ${admin.email}` });
    revalidatePath("/admin/ai-integrations");
    return { ok: true, message: "Revoked. This connection cannot be used any more." };
  } catch {
    return { ok: false, error: "Could not revoke the connection. Please try again." };
  }
}

/** Removes a revoked connection from the list (its submissions stay, they keep the connection's name). */
export async function removeConnection(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const row = await db.aiConnection.findUnique({ where: { id }, select: { revokedAt: true } });
    if (!row?.revokedAt) return { ok: false, error: "Revoke the connection first." };
    await db.aiConnection.delete({ where: { id } });
    revalidatePath("/admin/ai-integrations");
    return { ok: true, message: "Removed from the list." };
  } catch {
    return { ok: false, error: "Could not remove the connection. Please try again." };
  }
}

export type DecideResult = { ok: true; url: string } | { ok: false; error: string };

/** The consent screen: the admin pressed "Allow" or "Deny". Everything is checked again here; the answer is the address to send the browser to. */
export async function decideAuthorization(input: AuthorizeParams & { approve: boolean }): Promise<DecideResult> {
  const admin = await requireAdmin();
  if (aiDisabled()) return { ok: false, error: "The AI integration is switched off on this website." };
  const check = await checkAuthorize({
    clientId: String(input.clientId ?? ""),
    redirectUri: String(input.redirectUri ?? ""),
    scope: String(input.scope ?? ""),
    state: String(input.state ?? ""),
    codeChallenge: String(input.codeChallenge ?? ""),
    codeChallengeMethod: String(input.codeChallengeMethod ?? ""),
    responseType: String(input.responseType ?? ""),
  });
  if (!check.ok) return { ok: false, error: check.error };
  const back = new URL(check.redirectUri);
  if (check.state) back.searchParams.set("state", check.state);
  if (!input.approve) {
    back.searchParams.set("error", "access_denied");
    return { ok: true, url: back.toString() };
  }
  if (!rateLimit(`oauth-allow:${admin.id}`, 20, 60 * 60_000)) return { ok: false, error: "Too many connections in a short time. Please wait a little." };
  try {
    const code = await issueCode(check, admin.id);
    back.searchParams.set("code", code);
    alertLater({ level: "info", kind: "ai", title: `AI tool allowed: ${check.client.name}`, detail: `By ${admin.email}. Permissions: ${check.scopes.join(", ")}` });
    return { ok: true, url: back.toString() };
  } catch (error) {
    console.error("decideAuthorization failed", error);
    alertFailure("Allowing an AI tool (admin)", error, "warning");
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
