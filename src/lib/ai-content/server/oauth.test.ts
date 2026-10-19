import { createHash, randomBytes } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeDb } from "@/test/fake-db";

const fake = vi.hoisted(() => ({ current: null as ReturnType<typeof import("@/test/fake-db").createFakeDb> | null }));
vi.mock("@/lib/db", () => ({
  hasDb: true,
  get db() {
    return fake.current!.db;
  },
}));
vi.mock("@/lib/alerts", () => ({ alertFailure: vi.fn(), alertLater: vi.fn() }));

import { POST as mcp } from "@/app/api/mcp/route";
import { GET as authServer } from "@/app/.well-known/oauth-authorization-server/route";
import { GET as resource } from "@/app/.well-known/oauth-protected-resource/route";
import { POST as register } from "@/app/api/oauth/register/route";
import { POST as revoke } from "@/app/api/oauth/revoke/route";
import { POST as token } from "@/app/api/oauth/token/route";
import { checkAuthorize, isAllowedRedirectUri, issueCode, pkceChallenge } from "./oauth";

const ORIGIN = "https://site.example";
let ip = 0;
const req = (path: string, init: RequestInit & { json?: unknown; form?: Record<string, string> } = {}) => {
  const headers = new Headers(init.headers);
  headers.set("x-forwarded-for", `10.1.0.${(ip = (ip + 1) % 250)}`);
  let body = init.body;
  if (init.json !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(init.json);
  }
  if (init.form) {
    headers.set("content-type", "application/x-www-form-urlencoded");
    body = new URLSearchParams(init.form).toString();
  }
  return new Request(`${ORIGIN}${path}`, { method: "POST", ...init, headers, body });
};

const verifier = randomBytes(40).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");
const REDIRECT = "https://claude.example/callback";

async function connectClient() {
  const reg = await (await register(req("/api/oauth/register", { json: { client_name: "Claude", redirect_uris: [REDIRECT] } }))).json();
  const check = await checkAuthorize({ clientId: reg.client_id, redirectUri: REDIRECT, scope: "content:submit content:read", state: "xyz", codeChallenge: challenge, codeChallengeMethod: "S256", responseType: "code" });
  if (!check.ok) throw new Error(check.error);
  const code = await issueCode(check, "admin1");
  return { clientId: reg.client_id as string, code };
}

beforeEach(() => {
  fake.current = createFakeDb();
  fake.current.tables.adminUser.push({ id: "admin1", email: "harsh@we3vision.com" });
});

describe("discovery", () => {
  it("advertises the endpoints, PKCE and public clients", async () => {
    const meta = await authServer(new Request(`${ORIGIN}/.well-known/oauth-authorization-server`)).json();
    expect(meta).toMatchObject({ issuer: ORIGIN, token_endpoint: `${ORIGIN}/api/oauth/token`, registration_endpoint: `${ORIGIN}/api/oauth/register`, code_challenge_methods_supported: ["S256"], token_endpoint_auth_methods_supported: ["none"] });
    const res = await resource(new Request(`${ORIGIN}/.well-known/oauth-protected-resource`)).json();
    expect(res).toMatchObject({ resource: `${ORIGIN}/api/mcp`, authorization_servers: [ORIGIN] });
  });
});

describe("redirect addresses", () => {
  it.each([
    ["https://claude.ai/api/mcp/auth_callback", true],
    ["http://localhost:6274/oauth/callback", true],
    ["http://127.0.0.1:33418/cb", true],
    ["cursor://anysphere.cursor-mcp/oauth/callback", true],
    ["http://evil.example/cb", false],
    ["javascript:alert(1)", false],
    ["data:text/html,hi", false],
    ["https://claude.ai/cb#frag", false],
    ["https://user:pass@claude.ai/cb", false],
    ["not a url", false],
  ])("%s -> %s", (uri, ok) => expect(isAllowedRedirectUri(uri)).toBe(ok));
});

describe("registration", () => {
  it("registers a public client", async () => {
    const res = await register(req("/api/oauth/register", { json: { client_name: "Claude", redirect_uris: [REDIRECT] } }));
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ client_name: "Claude", token_endpoint_auth_method: "none" });
  });
  it("refuses unsafe addresses and confidential clients", async () => {
    expect((await register(req("/api/oauth/register", { json: { client_name: "x", redirect_uris: ["http://evil.example/cb"] } }))).status).toBe(400);
    expect((await register(req("/api/oauth/register", { json: { client_name: "x", redirect_uris: [REDIRECT], token_endpoint_auth_method: "client_secret_basic" } }))).status).toBe(400);
  });
});

describe("authorization request", () => {
  it("rejects a return address that was not registered, and a missing PKCE challenge", async () => {
    const reg = await (await register(req("/api/oauth/register", { json: { client_name: "Claude", redirect_uris: [REDIRECT] } }))).json();
    const base = { clientId: reg.client_id, redirectUri: REDIRECT, scope: "", state: "", codeChallenge: challenge, codeChallengeMethod: "S256", responseType: "code" };
    expect((await checkAuthorize({ ...base, redirectUri: "https://evil.example/cb" })).ok).toBe(false);
    expect((await checkAuthorize({ ...base, codeChallengeMethod: "plain" })).ok).toBe(false);
    expect((await checkAuthorize({ ...base, codeChallenge: "" })).ok).toBe(false);
    expect((await checkAuthorize({ ...base, clientId: "w3c_unknown_client_00000" })).ok).toBe(false);
    expect((await checkAuthorize(base)).ok).toBe(true);
  });
});

describe("full flow: code -> tokens -> MCP -> refresh -> revoke", () => {
  it("works end to end, and the code can be used only once", async () => {
    const { clientId, code } = await connectClient();
    const res = await token(req("/api/oauth/token", { form: { grant_type: "authorization_code", code, redirect_uri: REDIRECT, client_id: clientId, code_verifier: verifier } }));
    expect(res.status).toBe(200);
    const t = await res.json();
    expect(t).toMatchObject({ token_type: "Bearer", expires_in: 3600, scope: "content:submit content:read" });
    expect(t.access_token).toMatch(/^w3v_at_/);

    // the access token opens the MCP server
    const listed = await mcp(req("/api/mcp", { headers: { authorization: `Bearer ${t.access_token}`, accept: "application/json, text/event-stream" }, json: { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} } }));
    expect(listed.status).toBe(200);

    // the same code again is refused
    const again = await token(req("/api/oauth/token", { form: { grant_type: "authorization_code", code, redirect_uri: REDIRECT, client_id: clientId, code_verifier: verifier } }));
    expect(again.status).toBe(400);
    expect((await again.json()).error).toBe("invalid_grant");

    // only hashes are stored
    const row = fake.current!.tables.aiConnection[0];
    expect(JSON.stringify(row)).not.toContain(t.access_token);
    expect(JSON.stringify(row)).not.toContain(t.refresh_token);

    // refresh: new tokens, the old access token stops working
    const r = await token(req("/api/oauth/token", { form: { grant_type: "refresh_token", refresh_token: t.refresh_token, client_id: clientId } }));
    expect(r.status).toBe(200);
    const t2 = await r.json();
    expect(t2.access_token).not.toBe(t.access_token);
    const old = await mcp(req("/api/mcp", { headers: { authorization: `Bearer ${t.access_token}`, accept: "application/json, text/event-stream" }, json: { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} } }));
    expect(old.status).toBe(401);
    expect((await token(req("/api/oauth/token", { form: { grant_type: "refresh_token", refresh_token: t.refresh_token, client_id: clientId } }))).status).toBe(400);

    // revoke: at once
    await revoke(req("/api/oauth/revoke", { form: { token: t2.access_token } }));
    const after = await mcp(req("/api/mcp", { headers: { authorization: `Bearer ${t2.access_token}`, accept: "application/json, text/event-stream" }, json: { jsonrpc: "2.0", id: 1, method: "tools/list", params: {} } }));
    expect(after.status).toBe(401);
  });

  it("refuses a wrong PKCE verifier and burns the code", async () => {
    const { clientId, code } = await connectClient();
    const bad = await token(req("/api/oauth/token", { form: { grant_type: "authorization_code", code, redirect_uri: REDIRECT, client_id: clientId, code_verifier: randomBytes(40).toString("base64url") } }));
    expect(bad.status).toBe(400);
    const good = await token(req("/api/oauth/token", { form: { grant_type: "authorization_code", code, redirect_uri: REDIRECT, client_id: clientId, code_verifier: verifier } }));
    expect(good.status).toBe(400);
  });

  it("refuses a code used with another return address or another client", async () => {
    const { clientId, code } = await connectClient();
    const other = await token(req("/api/oauth/token", { form: { grant_type: "authorization_code", code, redirect_uri: "https://evil.example/cb", client_id: clientId, code_verifier: verifier } }));
    expect(other.status).toBe(400);
  });

  it("an expired code is refused", async () => {
    const { clientId, code } = await connectClient();
    fake.current!.tables.oauthCode[0].expiresAt = new Date(Date.now() - 1000);
    const res = await token(req("/api/oauth/token", { form: { grant_type: "authorization_code", code, redirect_uri: REDIRECT, client_id: clientId, code_verifier: verifier } }));
    expect(res.status).toBe(400);
  });

  it("connecting the same tool again replaces its older connection", async () => {
    const first = await connectClient();
    await token(req("/api/oauth/token", { form: { grant_type: "authorization_code", code: first.code, redirect_uri: REDIRECT, client_id: first.clientId, code_verifier: verifier } }));
    const check = await checkAuthorize({ clientId: first.clientId, redirectUri: REDIRECT, scope: "", state: "", codeChallenge: challenge, codeChallengeMethod: "S256", responseType: "code" });
    if (!check.ok) throw new Error("check failed");
    const code2 = await issueCode(check, "admin1");
    await token(req("/api/oauth/token", { form: { grant_type: "authorization_code", code: code2, redirect_uri: REDIRECT, client_id: first.clientId, code_verifier: verifier } }));
    const rows = fake.current!.tables.aiConnection;
    expect(rows).toHaveLength(2);
    expect(rows.filter((r) => !r.revokedAt)).toHaveLength(1);
  });
});

describe("pkce helper", () => {
  it("matches the S256 rule of RFC 7636", () => {
    expect(pkceChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });
});
