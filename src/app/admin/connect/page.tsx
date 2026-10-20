import { ConsentCard } from "@/components/admin/consent-card";
import { requireAdmin } from "@/lib/auth";
import { checkAuthorize } from "@/lib/ai-content/server/oauth";

export const metadata = { title: "Connect an AI tool" };

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

// The consent screen of the OAuth flow: an AI tool (Claude, Cursor …) sent the admin here. Not logged in -> the proxy sends them to the login
// and back. The address is under /admin, so it is never indexed or cached. Nothing happens until the admin presses "Allow".
export default async function ConnectPage({ searchParams }: { searchParams: Promise<Search> }) {
  const admin = await requireAdmin();
  const q = await searchParams;
  const params = {
    clientId: one(q.client_id),
    redirectUri: one(q.redirect_uri),
    scope: one(q.scope),
    state: one(q.state),
    codeChallenge: one(q.code_challenge),
    codeChallengeMethod: one(q.code_challenge_method),
    responseType: one(q.response_type),
  };
  const check = await checkAuthorize(params).catch(() => ({ ok: false as const, error: "The website database is not available." }));
  const back = check.ok ? new URL(check.redirectUri) : null;
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-10">
      <ConsentCard
        adminName={admin.name}
        adminEmail={admin.email}
        error={check.ok ? null : check.error}
        client={check.ok ? check.client.name : ""}
        returnHost={back ? back.host || back.protocol : ""}
        scopes={check.ok ? check.scopes : []}
        params={params}
      />
    </main>
  );
}
