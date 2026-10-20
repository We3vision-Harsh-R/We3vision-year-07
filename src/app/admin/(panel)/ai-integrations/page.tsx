import { headers } from "next/headers";
import { AiIntegrations, type ConnectionRow, type ToolRow } from "@/components/admin/ai-integrations";
import { getAiSettings } from "@/lib/ai-content/server/settings";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "AI Integrations" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

async function siteOrigin() {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  if (/^https?:\/\//.test(configured)) return configured;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:1010";
  return `${h.get("x-forwarded-proto") ?? "http"}://${host}`;
}

function hostOf(uri: string) {
  try {
    const u = new URL(uri);
    return u.host || u.protocol;
  } catch {
    return uri.slice(0, 40);
  }
}

export default async function AiIntegrationsPage() {
  const me = await requireAdmin();
  const [rows, pending, clients, settings] = await Promise.all([
    db.aiConnection.findMany({ orderBy: { createdAt: "desc" }, include: { admin: { select: { email: true } }, _count: { select: { submissions: true } } } }),
    db.contentSubmission.count({ where: { status: "pending_review" } }),
    db.oauthClient.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    getAiSettings(),
  ]);
  const now = new Date();
  const connections: ConnectionRow[] = rows.map((c) => ({
    id: c.id,
    name: c.name,
    kind: c.kind === "oauth" ? "oauth" : "token",
    owner: c.admin.email,
    mine: c.adminId === me.id,
    scopes: c.scopes.split(" ").filter(Boolean),
    hint: c.tokenHint,
    created: fmt.format(c.createdAt),
    lastUsed: c.lastUsedAt ? fmt.format(c.lastUsedAt) : "never",
    expires: c.expiresAt ? fmt.format(c.expiresAt) : "",
    status: c.revokedAt ? "revoked" : c.expiresAt && c.expiresAt < now ? "expired" : "active",
    submissions: c._count.submissions,
  }));
  const tools: ToolRow[] = clients.map((c) => ({
    id: c.id,
    name: c.name,
    hosts: (Array.isArray(c.redirectUris) ? (c.redirectUris as unknown[]) : []).filter((u): u is string => typeof u === "string").map(hostOf).join(", ") || "-",
    registered: fmt.format(c.createdAt),
    active: rows.filter((r) => r.clientId === c.id && !r.revokedAt && (!r.expiresAt || r.expiresAt >= now)).length,
  }));
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Integrations</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Let AI tools (Claude, Cursor, ChatGPT …) write blog articles and job posts for you. They can only send drafts to <b>AI Submissions</b> ({pending} waiting now); nothing goes live until you approve it.
        </p>
      </div>
      <AiIntegrations mcpUrl={`${await siteOrigin()}/api/mcp`} connections={connections} tools={tools} switches={settings} />
    </div>
  );
}
