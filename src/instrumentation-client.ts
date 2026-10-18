// Runs in every visitor's browser before the page starts. A JavaScript error of the website (a part of a page that crashes) is sent to
// /api/alerts/client, which turns it into an alert for the admin panel. At most 5 reports per page, only errors of this site's own
// scripts (not of browser extensions), and nothing about the visitor except the page address and the error text.
const seen = new Set<string>();

function report(message: string, source: string, stack: string) {
  try {
    if (seen.size >= 5 || !message || /ResizeObserver loop|Script error\.?$|Non-Error promise rejection|AbortError|ChunkLoadError|Loading chunk|dynamically imported module/i.test(message)) return; // an old script gone after a deploy: Next.js reloads by itself
    if (source && !source.startsWith(location.origin)) return;
    const key = message.slice(0, 120);
    if (seen.has(key)) return;
    seen.add(key);
    const body = JSON.stringify({ message: message.slice(0, 300), source: source.slice(0, 300), stack: stack.slice(0, 1200), path: location.pathname.slice(0, 200) });
    navigator.sendBeacon?.("/api/alerts/client", body);
  } catch {
    // never let the reporter itself break the page
  }
}

window.addEventListener("error", (e) => {
  if (!(e.error instanceof Error) && !e.message) return; // a picture or a script that did not load: not a JavaScript error
  report(String(e.message || e.error?.message || ""), String(e.filename || ""), String(e.error?.stack || ""));
});
window.addEventListener("unhandledrejection", (e) => {
  const r = e.reason as { message?: unknown; stack?: unknown } | undefined;
  if (!(r instanceof Error)) return;
  const stack = String(r.stack || "");
  if (!stack.includes(location.origin) && !stack.includes("/_next/")) return;
  report(String(r.message || ""), "", stack);
});
