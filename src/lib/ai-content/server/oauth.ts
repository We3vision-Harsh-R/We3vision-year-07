import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { DEFAULT_SCOPES, hashToken, hintOf, newToken, parseScopes, type Scope } from "./tokens";

// OAuth 2.1 for the MCP server (the way claude.ai custom connectors, Claude Desktop and Cursor connect): dynamic client registration,
// authorization code + PKCE (S256 only, public clients), refresh tokens that rotate. The person is the admin who is logged in to the admin
// panel and presses "Allow" on the consent screen (src/app/admin/connect). The result of the flow is an AiConnection row, exactly like a
// personal access token, so it is listed and revoked in the same place.

export const ACCESS_TTL_S = 60 * 60; // an access token lives one hour
export const CONNECTION_TTL_MS = 90 * 24 * 60 * 60_000; // an unused connection ends after 90 days (every refresh moves it)
export const CODE_TTL_MS = 10 * 60_000;
const MAX_CLIENTS = 2000; // registration is open (that is how claude.ai connects), so the table is capped

const BLOCKED_SCHEMES = new Set(["javascript:", "data:", "file:", "blob:", "vbscript:", "about:", "ftp:", "ws:", "wss:", "chrome:", "view-source:"]);

/** https, http on this computer (localhost), or the custom address of a desktop app (cursor://…, claude://…). No fragments, no passwords. */
export function isAllowedRedirectUri(uri: string): boolean {
  if (typeof uri !== "string" || uri.length === 0 || uri.length > 300) return false;
  let u: URL;
  try {
    u = new URL(uri);
  } catch {
    return false;
  }
  if (u.hash || u.username || u.password) return false;
  if (u.protocol === "https:") return true;
  if (u.protocol === "http:") return ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname);
  return /^[a-z][a-z0-9+.-]*:$/.test(u.protocol) && !BLOCKED_SCHEMES.has(u.protocol);
}

const b64url = (b: Buffer) => b.toString("base64url");
export const pkceChallenge = (verifier: string) => b64url(createHash("sha256").update(verifier).digest());

// --- registration -----------------------------------------------------------------------------------------------------------------

export type RegisterResult = { ok: true; client: { client_id: string; client_name: string; redirect_uris: string[] } } | { ok: false; error: string; description: string };

export async function registerClient(body: unknown): Promise<RegisterResult> {
  const o = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const uris = Array.isArray(o.redirect_uris) ? o.redirect_uris : [];
  if (uris.length === 0 || uris.length > 5 || !uris.every((u) => typeof u === "string" && isAllowedRedirectUri(u))) {
    return { ok: false, error: "invalid_redirect_uri", description: "redirect_uris must list 1–5 https:// (or localhost / app) addresses." };
  }
  if (o.token_endpoint_auth_method !== undefined && o.token_endpoint_auth_method !== "none") {
    return { ok: false, error: "invalid_client_metadata", description: "Only public clients (token_endpoint_auth_method: none) with PKCE are supported." };
  }
  if ((await db.oauthClient.count()) >= MAX_CLIENTS) return { ok: false, error: "invalid_client_metadata", description: "Too many registered tools. Ask the site owner to clean up." };
  const name = (typeof o.client_name === "string" ? o.client_name : "").replace(/[\u0000-\u001F<>]/g, "").trim().slice(0, 80) || "AI tool";
  const client_id = `w3c_${randomBytes(16).toString("base64url")}`;
  const redirect_uris = [...new Set(uris as string[])];
  await db.oauthClient.create({ data: { id: client_id, name, redirectUris: redirect_uris } });
  return { ok: true, client: { client_id, client_name: name, redirect_uris } };
}

export async function getClient(clientId: string) {
  if (!/^w3c_[A-Za-z0-9_-]{16,40}$/.test(clientId)) return null;
  const row = await db.oauthClient.findUnique({ where: { id: clientId } });
  if (!row) return null;
  const uris = Array.isArray(row.redirectUris) ? (row.redirectUris as unknown[]).filter((u): u is string => typeof u === "string") : [];
  return { id: row.id, name: row.name, redirectUris: uris };
}

// --- the authorization request ----------------------------------------------------------------------------------------------------

export type AuthorizeParams = { clientId: string; redirectUri: string; scope: string; state: string; codeChallenge: string; codeChallengeMethod: string; responseType: string };
export type AuthorizeCheck = { ok: true; client: { id: string; name: string }; redirectUri: string; scopes: Scope[]; state: string; codeChallenge: string } | { ok: false; error: string };

/** Checks everything of an authorization request (the consent screen AND the "Allow" action both call it: nothing from the form is trusted). */
export async function checkAuthorize(p: AuthorizeParams): Promise<AuthorizeCheck> {
  const client = await getClient(p.clientId);
  if (!client) return { ok: false, error: "This tool is not registered. Disconnect it and connect again." };
  if (!client.redirectUris.includes(p.redirectUri)) return { ok: false, error: "The return address of the tool does not match the one it registered." };
  if (p.responseType !== "code") return { ok: false, error: "Only response_type=code is supported." };
  if (p.codeChallengeMethod !== "S256" || !/^[A-Za-z0-9_-]{43}$/.test(p.codeChallenge)) return { ok: false, error: "PKCE with S256 is required." };
  const asked = parseScopes(p.scope || DEFAULT_SCOPES);
  const scopes = asked.length ? asked : parseScopes(DEFAULT_SCOPES);
  return { ok: true, client: { id: client.id, name: client.name }, redirectUri: p.redirectUri, scopes, state: p.state.slice(0, 500), codeChallenge: p.codeChallenge };
}

/** Called when the admin presses "Allow": makes a one-time code (10 minutes). */
export async function issueCode(check: Extract<AuthorizeCheck, { ok: true }>, adminId: string): Promise<string> {
  const code = randomBytes(32).toString("base64url");
  await db.oauthCode.create({
    data: { codeHash: hashToken(code), clientId: check.client.id, adminId, redirectUri: check.redirectUri, codeChallenge: check.codeChallenge, scopes: check.scopes.join(" "), expiresAt: new Date(Date.now() + CODE_TTL_MS) },
  });
  return code;
}

// --- token endpoint ---------------------------------------------------------------------------------------------------------------

export type TokenResult =
  | { ok: true; body: { access_token: string; token_type: "Bearer"; expires_in: number; refresh_token: string; scope: string } }
  | { ok: false; status: 400 | 401; error: string; description: string };

const bad = (error: string, description: string): TokenResult => ({ ok: false, status: 400, error, description });

async function mint(connectionId: string, scopes: string) {
  const access = newToken("at");
  const refresh = newToken("rt");
  const now = Date.now();
  await db.aiConnection.update({
    where: { id: connectionId },
    data: { tokenHash: hashToken(access), tokenHint: hintOf(access), refreshHash: hashToken(refresh), accessExpiresAt: new Date(now + ACCESS_TTL_S * 1000), expiresAt: new Date(now + CONNECTION_TTL_MS) },
  });
  return { access_token: access, token_type: "Bearer" as const, expires_in: ACCESS_TTL_S, refresh_token: refresh, scope: scopes };
}

export async function exchangeCode(p: { code: string; redirectUri: string; clientId: string; verifier: string }): Promise<TokenResult> {
  if (!p.code || !p.verifier || !p.clientId) return bad("invalid_request", "code, code_verifier and client_id are required.");
  if (p.verifier.length < 43 || p.verifier.length > 128) return bad("invalid_grant", "code_verifier has the wrong length.");
  const now = new Date();
  const codeHash = hashToken(p.code);
  // claim the code first: it can be used once, whatever the result (a wrong try burns it)
  const claimed = await db.oauthCode.updateMany({ where: { codeHash, usedAt: null, expiresAt: { gt: now } }, data: { usedAt: now } });
  if (claimed.count !== 1) return bad("invalid_grant", "The code is wrong, expired or already used.");
  const row = await db.oauthCode.findUnique({ where: { codeHash } });
  if (!row || row.clientId !== p.clientId || row.redirectUri !== p.redirectUri) return bad("invalid_grant", "The code does not belong to this client or return address.");
  if (pkceChallenge(p.verifier) !== row.codeChallenge) return bad("invalid_grant", "PKCE check failed.");
  const client = await getClient(row.clientId);
  const admin = await db.adminUser.findUnique({ where: { id: row.adminId }, select: { id: true } });
  if (!client || !admin) return bad("invalid_grant", "The client or the admin does not exist any more.");

  // connecting the same tool again replaces its older connection of this admin
  await db.aiConnection.updateMany({ where: { adminId: row.adminId, clientId: client.id, kind: "oauth", revokedAt: null }, data: { revokedAt: now } });
  const first = newToken("at");
  const created = await db.aiConnection.create({
    data: { name: client.name, kind: "oauth", adminId: row.adminId, tokenHash: hashToken(first), tokenHint: hintOf(first), scopes: row.scopes, clientId: client.id, expiresAt: new Date(now.getTime() + CONNECTION_TTL_MS) },
    select: { id: true },
  });
  return { ok: true, body: await mint(created.id, row.scopes) };
}

export async function refreshTokens(p: { refreshToken: string; clientId: string }): Promise<TokenResult> {
  if (!/^w3v_rt_[A-Za-z0-9_-]{20,100}$/.test(p.refreshToken)) return bad("invalid_grant", "The refresh token is not valid.");
  const row = await db.aiConnection.findUnique({ where: { refreshHash: hashToken(p.refreshToken) } });
  const now = new Date();
  if (!row || row.revokedAt || row.kind !== "oauth" || (row.expiresAt && row.expiresAt < now) || (p.clientId && row.clientId !== p.clientId)) {
    return bad("invalid_grant", "The refresh token is revoked, expired or unknown. Connect again.");
  }
  return { ok: true, body: await mint(row.id, row.scopes) };
}

/** RFC 7009: revokes the connection that owns this token (access or refresh). Unknown tokens are ignored. */
export async function revokeToken(token: string): Promise<void> {
  if (!/^w3v_(at|rt|pat)_/.test(token)) return;
  const h = hashToken(token);
  await db.aiConnection.updateMany({ where: { OR: [{ tokenHash: h }, { refreshHash: h }], revokedAt: null }, data: { revokedAt: new Date() } });
}

/** Removes old codes (called now and then). */
export async function pruneCodes(): Promise<void> {
  await db.oauthCode.deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60_000) } } }).catch(() => undefined);
}
