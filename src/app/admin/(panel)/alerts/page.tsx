import Link from "next/link";
import { clearReadAlerts, deleteAlert, markAlertRead, markAllAlertsRead, sendTestWhatsApp } from "@/actions/alerts";
import { CopyAlert } from "@/components/admin/alert-copy";
import { AlertRecheck } from "@/components/admin/alert-recheck";
import { btnDanger, btnPrimary, btnSecondary, card } from "@/components/admin/ui";
import { alertKindName } from "@/lib/alert-report";
import { type AlertLevel, readAlerts } from "@/lib/alerts";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { whatsappProvider } from "@/lib/whatsapp";

export const metadata = { title: "Alerts" };

const LEVELS: { value: AlertLevel; label: string; badge: string; border: string }[] = [
  { value: "critical", label: "Critical", badge: "bg-rose-600 text-white", border: "border-rose-300" },
  { value: "warning", label: "Warning", badge: "bg-amber-500 text-white", border: "border-amber-300" },
  { value: "info", label: "Info", badge: "bg-sky-600 text-white", border: "border-sky-200" },
];
const look = (level: AlertLevel) => LEVELS.find((l) => l.value === level) ?? LEVELS[2];

/** how many alerts "Copy for AI" at the top puts in one prompt */
const COPY_MAX = 10;

const PROVIDERS = { callmebot: "CallMeBot", cloud: "WhatsApp Cloud API", webhook: "Webhook" } as const;
const TEST: Record<string, { text: string; good: boolean }> = {
  ok: { text: "The test message is sent. Check your WhatsApp.", good: true },
  fail: { text: "The WhatsApp service did not accept the message. Check the number and the key in the server settings.", good: false },
  off: { text: "WhatsApp is not set up yet (see the steps below).", good: false },
  wait: { text: "Too many test messages. Please wait 10 minutes.", good: false },
};

export default async function AlertsPage({ searchParams }: { searchParams: Promise<{ level?: string; test?: string }> }) {
  await requireAdmin();
  const { level, test } = await searchParams;
  const all = await readAlerts();
  const shown = level === "solved" ? all.filter((a) => a.resolved) : LEVELS.some((l) => l.value === level) ? all.filter((a) => a.level === level) : all;
  const provider = whatsappProvider();
  const notice = test ? TEST[test] : undefined;
  const unread = all.filter((a) => !a.read).length;
  const solved = all.filter((a) => a.resolved).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Problems and attacks on the whole website: server errors, failed saves, blocked hacking requests, login attacks, errors in visitors&apos; browsers (latest 300). Critical and
          warning alerts are also sent to WhatsApp.
        </p>
      </div>

      {notice && <p className={`rounded-xl px-4 py-3 text-sm ${notice.good ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>{notice.text}</p>}

      <section className={card}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">WhatsApp alerts</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {provider ? (
                <>
                  Connected with <b className="text-zinc-800">{PROVIDERS[provider]}</b>. New contact messages and serious alerts arrive on WhatsApp (the same alert at most once in 30
                  minutes, 12 messages an hour at most).
                </>
              ) : (
                "Not set up yet. The alerts are still kept on this page."
              )}
            </p>
          </div>
          <form action={sendTestWhatsApp}>
            <button className={btnPrimary} disabled={!provider}>
              Send a test message
            </button>
          </form>
        </div>
        {!provider && (
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-zinc-600">
            <li>
              Open{" "}
              <a className="text-brand underline" href="https://www.callmebot.com/blog/free-api-whatsapp-messages/" target="_blank" rel="noreferrer noopener">
                callmebot.com (Free WhatsApp API)
              </a>{" "}
              and do step 1: save their WhatsApp number in your phone and send it the message they show.
            </li>
            <li>The bot answers with your API key.</li>
            <li>
              In Hostinger (Website &gt; Environment variables) add <code className="rounded bg-zinc-100 px-1">ALERT_WHATSAPP_TO</code> = your number with the country code (for example
              91XXXXXXXXXX) and <code className="rounded bg-zinc-100 px-1">CALLMEBOT_APIKEY</code> = the key, then deploy again.
            </li>
            <li>Come back here and press &quot;Send a test message&quot;.</li>
          </ol>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filter alerts" className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/alerts" className={`rounded-full border px-3 py-1.5 ${!level ? "border-zinc-800 bg-zinc-800 text-white" : "border-zinc-300 text-zinc-700"}`}>
            All ({all.length})
          </Link>
          {LEVELS.map((l) => (
            <Link
              key={l.value}
              href={`/admin/alerts?level=${l.value}`}
              className={`rounded-full border px-3 py-1.5 ${level === l.value ? "border-zinc-800 bg-zinc-800 text-white" : "border-zinc-300 text-zinc-700"}`}
            >
              {l.label} ({all.filter((a) => a.level === l.value).length})
            </Link>
          ))}
          <Link href="/admin/alerts?level=solved" className={`rounded-full border px-3 py-1.5 ${level === "solved" ? "border-zinc-800 bg-zinc-800 text-white" : "border-zinc-300 text-zinc-700"}`}>
            Solved ({solved})
          </Link>
        </nav>
        <div className="flex flex-wrap gap-2">
          {shown.length > 0 && <CopyAlert alerts={shown.slice(0, COPY_MAX)} label={`Copy ${Math.min(shown.length, COPY_MAX)} for AI`} className={btnSecondary} />}
          {unread > 0 && (
            <form action={markAllAlertsRead}>
              <button className={btnSecondary}>Mark all as read</button>
            </form>
          )}
          {all.some((a) => a.read) && (
            <form action={clearReadAlerts}>
              <button className={btnDanger}>Delete read alerts</button>
            </form>
          )}
        </div>
      </div>

      {shown.length === 0 && <p className={`${card} text-sm text-zinc-400`}>No alerts. Everything is running fine.</p>}
      <div className="space-y-3">
        {shown.map((a) => {
          const l = look(a.level);
          return (
            <article key={a.id} className={`${card} ${a.resolved ? "opacity-60" : a.read ? "opacity-70" : l.border}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.badge}`}>{l.label}</span>
                    {a.resolved && <span className="ads-solved-tag">✓ Solved</span>}
                    <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs font-medium text-zinc-600">{alertKindName(a.kind)}</span>
                    <span className="break-words">{a.title}</span>
                    {a.count > 1 && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">× {a.count}</span>}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {a.path && <span className="mr-3">Page: {a.path}</span>}
                    {a.ip && <span>From: {a.ip}</span>}
                  </p>
                </div>
                <time className="text-xs text-zinc-400" dateTime={a.lastAt}>
                  {formatDate(new Date(a.lastAt))}
                  {a.count > 1 && <span className="block">first: {formatDate(new Date(a.firstAt))}</span>}
                </time>
              </div>
              {a.detail && <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-700">{a.detail}</pre>}
              <div className="mt-4 flex flex-wrap items-start gap-2">
                <CopyAlert alerts={[a]} label="Copy for AI" className={btnPrimary} />
                {!a.resolved && <AlertRecheck id={a.id} />}
                {!a.read && (
                  <form action={markAlertRead}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className={btnSecondary}>Mark as read</button>
                  </form>
                )}
                <form action={deleteAlert}>
                  <input type="hidden" name="id" value={a.id} />
                  <button className={btnDanger}>Delete</button>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
