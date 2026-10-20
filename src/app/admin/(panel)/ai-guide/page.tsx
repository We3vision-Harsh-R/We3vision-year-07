import Link from "next/link";
import { headers } from "next/headers";
import { CopyBox } from "@/components/admin/ai-integrations";
import { card } from "@/components/admin/ui";
import { CONTENT_TYPES } from "@/lib/ai-content/registry";
import { limitText } from "@/lib/ai-content/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "AI Guide" };

async function siteOrigin() {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  if (/^https?:\/\//.test(configured)) return configured;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:1010";
  return `${h.get("x-forwarded-proto") ?? "http"}://${host}`;
}

const PROMPTS = [
  "Write a blog article about 3D web design trends in 2026. Check my existing articles first, show me the preview, and do not send anything yet.",
  "Create a job post for a Senior UI/UX Designer, 3–5 years of experience, on-site in Surat. Use only the facts I gave you. Show me the preview first.",
  "Make the introduction shorter and add two more FAQ questions. Show me the new preview.",
  "This looks good. Send it to We3vision.",
  "Show my submissions and tell me which ones are waiting, approved or rejected.",
  "Why was my last article rejected? What should I change?",
];

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-zinc-900 text-xs font-semibold text-white">{n}</span>
      <span className="min-w-0 text-sm text-zinc-700">{children}</span>
    </li>
  );
}

function Where({ what, where, href, note }: { what: string; where: string; href: string; note?: string }) {
  return (
    <tr className="align-top">
      <td className="py-2.5 pr-4 text-sm text-zinc-700">{what}</td>
      <td className="whitespace-nowrap py-2.5 pr-4 text-sm font-medium">
        <Link href={href} className="text-brand hover:underline">
          {where}
        </Link>
      </td>
      <td className="py-2.5 text-sm text-zinc-500">{note}</td>
    </tr>
  );
}

export default async function AiGuidePage() {
  await requireAdmin();
  const mcpUrl = `${await siteOrigin()}/api/mcp`;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Guide</h1>
        <p className="mt-1 text-sm text-zinc-500">
          How to let an AI tool (Claude, Claude Code, Cursor, ChatGPT …) write blog articles and job posts for the website, and where to manage everything in this admin panel.
        </p>
        <nav className="mt-3 flex flex-wrap gap-2 text-sm" aria-label="On this page">
          {[
            ["how", "How it works"],
            ["where", "Where to do what"],
            ["connect", "Connect a tool"],
            ["use", "Use it"],
            ["types", "What the AI can create"],
            ["decide", "Approve or reject"],
            ["stop", "Stop access"],
            ["help", "If something goes wrong"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-zinc-700 hover:bg-zinc-50">
              {label}
            </a>
          ))}
        </nav>
      </div>

      <section id="how" className={`${card} space-y-3`}>
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="space-y-3">
          <Step n={1}>
            You connect an AI tool to the <b>MCP address</b> of the website (below). The tool signs in with your admin account, or uses a token you create.
          </Step>
          <Step n={2}>
            You ask the tool in plain words: “Write a blog about …” or “Create a job post for …”. The tool writes it with exactly the fields of the Blog and Job forms and shows you a preview. You can ask for changes as often as you like.
          </Step>
          <Step n={3}>
            When you say “send it”, the draft arrives in <Link href="/admin/ai-submissions" className="font-medium text-brand hover:underline">AI Submissions</Link> as <b>Pending approval</b>.
          </Step>
          <Step n={4}>
            You open it here, check the preview, edit it if you want, and press <b>Approve &amp; Publish</b> (it goes live) or <b>Reject</b> (it is kept with your reason and never shown).
          </Step>
        </ol>
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          The AI can <b>never</b> publish, edit or delete anything on the website. It can only create a pending draft and upload a picture file. Only you, here, make something live.
        </p>
      </section>

      <section id="where" className={`${card} space-y-3`}>
        <h2 className="text-lg font-semibold">Where to do what in this admin panel</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-400">
                <th className="py-2 pr-4 font-medium">I want to …</th>
                <th className="py-2 pr-4 font-medium">Go to</th>
                <th className="py-2 font-medium">There you can</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <Where what="Get the MCP address, connect a tool, make a token" where="AI Integrations" href="/admin/ai-integrations" note="Create connection, copy the address and token, choose permissions and how long it lasts." />
              <Where what="Stop one tool, or all tools" where="AI Integrations" href="/admin/ai-integrations" note="Revoke (one), Revoke all, Remove tool, or Block all AI tools with one button." />
              <Where what="Get a WhatsApp alert for each new draft" where="AI Integrations" href="/admin/ai-integrations" note="The tick box at the top. Needs WhatsApp alerts set up (Alerts)." />
              <Where what="See what AI sent, preview it, edit it" where="AI Submissions" href="/admin/ai-submissions" note="Tabs: Pending, Approved, Saved as draft, Rejected. The menu shows how many are waiting." />
              <Where what="Publish, save hidden, or reject a draft" where="AI Submissions" href="/admin/ai-submissions" note="Open a draft, then use the buttons on the right." />
              <Where what="Clean up old records" where="AI Submissions" href="/admin/ai-submissions" note="Open a finished one (approved, rejected, draft) and press Delete this record. The live item stays." />
              <Where what="Change or delete an article that is already live" where="Blog" href="/admin/blog" note="Approved articles are normal articles, edited here like all others." />
              <Where what="Change or close a job that is already live" where="Careers → Jobs" href="/admin/careers" note="Approved jobs are normal jobs." />
              <Where what="Open a draft that was saved hidden" where="Blog / Careers → Jobs" href="/admin/blog" note="The submission page has a link “open it in the normal editor”." />
              <Where what="See who connected or approved something, and when" where="AI Submissions → History" href="/admin/ai-submissions" note="Each draft shows who sent, edited, approved or rejected it. Alerts lists connection changes." />
              <Where what="Allow another person to approve" where="Admin access" href="/admin/access" note="Only @we3vision.com admin accounts can approve or connect tools." />
            </tbody>
          </table>
        </div>
      </section>

      <section id="connect" className={`${card} space-y-5`}>
        <h2 className="text-lg font-semibold">Connect a tool</h2>
        <CopyBox label="The MCP address of this website" value={mcpUrl} />
        <p className="text-sm text-zinc-500">Use this address in every tool below. Change nothing in it.</p>

        <div className="space-y-2">
          <h3 className="font-semibold">Claude (web or desktop app): no token needed</h3>
          <ol className="space-y-2">
            <Step n={1}>In Claude open <b>Settings → Connectors → Add custom connector</b>.</Step>
            <Step n={2}>Name it “We3vision” and paste the MCP address above.</Step>
            <Step n={3}>Claude opens this website. Log in with your admin account if asked, read the screen, and press <b>Allow</b>.</Step>
            <Step n={4}>Done. The tool is now listed in <Link href="/admin/ai-integrations" className="font-medium text-brand hover:underline">AI Integrations</Link>. It renews itself; a connection that is not used for 90 days ends.</Step>
          </ol>
          <p className="text-sm text-zinc-500">ChatGPT (developer mode → Connectors → Create) works the same way: paste the address and choose OAuth.</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Claude Code, Cursor and other tools that use a header: with a token</h3>
          <ol className="space-y-2">
            <Step n={1}>
              Go to <Link href="/admin/ai-integrations" className="font-medium text-brand hover:underline">AI Integrations</Link> → <b>Create a connection</b>. Give it a name (for example “Claude Code laptop”), keep both permissions ticked, choose how long it lasts.
            </Step>
            <Step n={2}>Copy the <b>token</b> at once. It is shown only one time. The page also shows the ready-made line for Claude Code and the settings for Cursor: copy and paste them.</Step>
            <Step n={3}>
              Claude Code: run in a terminal <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">claude mcp add --transport http we3vision {mcpUrl} --header &quot;Authorization: Bearer YOUR_TOKEN&quot;</code>
            </Step>
            <Step n={4}>Cursor: put the address and the header in <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">.cursor/mcp.json</code> (the page shows the exact text).</Step>
          </ol>
          <p className="text-sm text-zinc-500">Never paste a token in a chat, an e-mail or a public file. If one leaks, press Revoke on its connection and make a new one.</p>
        </div>
      </section>

      <section id="use" className={`${card} space-y-3`}>
        <h2 className="text-lg font-semibold">Use it: what to say to the AI</h2>
        <p className="text-sm text-zinc-500">Open a chat in the connected tool and write in your own words. Examples you can copy:</p>
        <ul className="space-y-2">
          {PROMPTS.map((p) => (
            <li key={p} className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-800">
              {p}
            </li>
          ))}
        </ul>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>Always tell it to show the preview first. It only sends after you clearly say “send it” / “submit it”.</li>
          <li>Give it the real facts (experience, salary, perks, links). It is told never to invent numbers, clients or testimonials.</li>
          <li>To use a cover picture, attach the picture in the chat and say “use this as the cover”.</li>
          <li>If the AI says a field is too long or missing, just ask it to fix it and try again.</li>
          <li>Up to 30 drafts can wait at the same time. Approve or reject some to make room.</li>
        </ul>
      </section>

      <section id="types" className={`${card} space-y-4`}>
        <h2 className="text-lg font-semibold">What the AI can create</h2>
        <p className="text-sm text-zinc-500">These are exactly the fields of the admin forms. The list below is read from the same place the AI reads it, so it is always up to date.</p>
        {CONTENT_TYPES.map((t) => (
          <div key={t.key} className="space-y-2">
            <h3 className="font-semibold">
              {t.label} <span className="text-xs font-normal text-zinc-400">({t.key})</span>
            </h3>
            <p className="text-sm text-zinc-600">{t.description}</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-400">
                    <th className="py-1.5 pr-3 font-medium">Field</th>
                    <th className="py-1.5 pr-3 font-medium">Needed?</th>
                    <th className="py-1.5 font-medium">Limits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {t.fields.map((f) => (
                    <tr key={f.name} className="align-top">
                      <td className="py-1.5 pr-3 font-medium">{f.label}</td>
                      <td className="py-1.5 pr-3 text-zinc-500">{f.required ? "Yes" : "No"}</td>
                      <td className="py-1.5 text-zinc-500">{limitText(f)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <details className="text-sm text-zinc-600">
              <summary className="cursor-pointer font-medium text-zinc-700">Writing rules the AI follows</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {t.guidelines.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </section>

      <section id="decide" className={`${card} space-y-3`}>
        <h2 className="text-lg font-semibold">Approve or reject a draft</h2>
        <p className="text-sm text-zinc-500">
          Open <Link href="/admin/ai-submissions" className="font-medium text-brand hover:underline">AI Submissions</Link> and click a draft. On the left you see how it will look on the website and every field; on the right the buttons:
        </p>
        <ul className="space-y-2 text-sm text-zinc-700">
          <li><b>Edit in the normal form</b>: the usual Blog or Job form, filled with the draft. Save your changes, then come back and approve. Nothing is live yet.</li>
          <li><b>Approve &amp; Publish</b>: it goes live now, exactly as if you had added it in Blog or Careers (address, order, search engines told).</li>
          <li><b>Save as a normal draft (hidden)</b>: it is put in the Blog or Jobs list but hidden, so you can finish it there and publish later.</li>
          <li><b>Reject</b>: write a short reason. It is kept, never shown on the website, and the AI tool can read your reason and try again.</li>
          <li><b>Delete this record</b> (finished drafts only): removes the record from the list. A live article or job stays.</li>
        </ul>
        <p className="text-sm text-zinc-500">The History box on each draft shows who sent, edited, approved or rejected it, and when.</p>
      </section>

      <section id="stop" className={`${card} space-y-3`}>
        <h2 className="text-lg font-semibold">Stop access</h2>
        <ul className="space-y-2 text-sm text-zinc-700">
          <li><b>One tool or token:</b> AI Integrations → <b>Revoke</b>. It stops with the next request.</li>
          <li><b>All tools at once:</b> AI Integrations → <b>Revoke all</b>.</li>
          <li><b>Block everything for a while:</b> AI Integrations → <b>Block all AI tools</b> (the switch at the top). Your connections stay; press <b>Allow AI tools</b> to continue.</li>
          <li><b>Forget a tool completely:</b> AI Integrations → Tools that signed in → <b>Remove tool</b>.</li>
          <li>If an admin account is deleted, its connections stop working.</li>
        </ul>
      </section>

      <section id="help" className={`${card} space-y-3`}>
        <h2 className="text-lg font-semibold">If something goes wrong</h2>
        <ul className="space-y-2 text-sm text-zinc-700">
          <li><b>The tool cannot connect:</b> check that AI tools are <i>allowed</i> (top of AI Integrations), that the address is copied fully, and that you are using the https address of the live site.</li>
          <li><b>“401” or “revoked”:</b> the connection ended or was revoked. Make a new one, or connect the tool again.</li>
          <li><b>“Not sent: the draft has errors”:</b> the AI shows which field and which limit. Ask it to fix that and send again.</li>
          <li><b>“30 drafts are already waiting”:</b> approve or reject some in AI Submissions.</li>
          <li><b>“Too many requests”:</b> wait a little (sending is limited to 10 per hour per connection).</li>
          <li><b>A picture is refused:</b> only JPG, PNG, WEBP or GIF up to 2 MB.</li>
          <li><b>I approved it but cannot see it:</b> open <Link href="/blog" className="text-brand hover:underline">/blog</Link> or <Link href="/careers" className="text-brand hover:underline">/careers</Link>; the site refreshes at once. For a hidden draft, publish it in Blog or Careers first.</li>
        </ul>
        <p className="text-sm text-zinc-500">The full technical manual (for developers) is the file docs/MCP_SETUP.md in the website code.</p>
      </section>
    </div>
  );
}
