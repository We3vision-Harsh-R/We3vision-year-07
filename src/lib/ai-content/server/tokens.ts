import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { isCompanyEmail } from "@/lib/admin-access";
import { db, hasDb } from "@/lib/db";

// Tokens of AI connections. A token is shown ONCE (when it is made); only its SHA-256 hash is stored. The prefix says what it is, so a secret
// scanner (GitHub, GitGuardian …) can recognise a leaked one.

export const SCOPES = ["content:submit", "content:read"] as const;
export type Scope = (typeof SCOPES)[number];
export const DEFAULT_SCOPES = SCOPES.join(" ");

export type TokenKind = "pat" | "at" | "rt";
export const newToken = (kind: TokenKind) => `w3v_${kind}_${randomBytes(32).toString("base64url")}`;
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const hintOf = (token: string) => `${token.slice(0, 12)}…`;

export function parseScopes(value: string): Scope[] {
  return value.split(/\s+/).filter((s): s is Scope => (SCOPES as readonly string[]).includes(s));
}

/** Who is calling the MCP server: the connection and the admin who made it. */
export type McpContext = {
  connectionId: string;
  connectionName: string;
  adminId: string;
  adminEmail: string;
  scopes: ReadonlySet<Scope>;
  /** the address of the website (https://…), for links in the answers */
  origin: string;
};

export type AuthResult = { ok: true; ctx: McpContext } | { ok: false; status: 401 | 403 | 503; reason: string };

const TOUCH_EVERY_MS = 60_000;

/** Checks the `Authorization: Bearer …` header of a request against the connections. Revoking a connection works at once (no cache). */
export async function authenticate(request: Request, origin: string): Promise<AuthResult> {
  if (!hasDb) return { ok: false, status: 503, reason: "The website database is not configured." };
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(w3v_(?:pat|at)_[A-Za-z0-9_-]{20,100})$/.exec(header);
  if (!match) return { ok: false, status: 401, reason: "Missing or invalid access token." };

  const row = await db.aiConnection.findUnique({ where: { tokenHash: hashToken(match[1]) }, include: { admin: { select: { id: true, email: true } } } });
  const now = new Date();
  if (!row || row.revokedAt) return { ok: false, status: 401, reason: "This connection was revoked or does not exist." };
  if (row.expiresAt && row.expiresAt < now) return { ok: false, status: 401, reason: "This connection has expired." };
  if (row.accessExpiresAt && row.accessExpiresAt < now) return { ok: false, status: 401, reason: "The access token has expired. Refresh it." };
  // the admin must still exist and still be a company account
  if (!isCompanyEmail(row.admin.email)) return { ok: false, status: 403, reason: "The admin account of this connection is not allowed." };

  if (!row.lastUsedAt || now.getTime() - row.lastUsedAt.getTime() > TOUCH_EVERY_MS) {
    void db.aiConnection.update({ where: { id: row.id }, data: { lastUsedAt: now } }).catch(() => undefined);
  }
  return {
    ok: true,
    ctx: { connectionId: row.id, connectionName: row.name, adminId: row.admin.id, adminEmail: row.admin.email, scopes: new Set(parseScopes(row.scopes)), origin },
  };
}
