import type { Instrumentation } from "next";

// Next.js calls onRequestError for every error of the server: a page that crashes, an API route, a server action, the proxy.
// Each one becomes a critical alert (Admin > Alerts + WhatsApp, see lib/alerts.ts). Normal control flow is skipped:
// redirect(), notFound(), a visitor who closed the page, an old browser tab that calls a server action of the previous build.
const SKIP_DIGEST = /^(?:NEXT_REDIRECT|NEXT_HTTP_ERROR_FALLBACK|NEXT_NOT_FOUND|DYNAMIC_SERVER_USAGE|BAILOUT_TO_CLIENT_SIDE_RENDERING|HANGING_PROMISE_REJECTION)/;
// "The destination stream closed early" = the visitor closed the tab or reloaded while the page was still streaming: not a bug of the site.
const SKIP_MESSAGE = /aborted|ECONNRESET|EPIPE|socket hang up|destination stream closed early/i;
const OLD_ACTION = /Failed to find Server Action|Server Action .* was not found/i;

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const e = err as { message?: unknown; digest?: unknown; name?: unknown; stack?: unknown } | null;
  const digest = typeof e?.digest === "string" ? e.digest : "";
  const message = typeof e?.message === "string" ? e.message : String(err);
  if (SKIP_DIGEST.test(digest) || SKIP_MESSAGE.test(message)) return;

  const { raiseAlert } = await import("@/lib/alerts");
  const path = (request.path || "").split("?")[0];
  const where = { render: "page", route: "API route", action: "form / server action", proxy: "proxy" }[context.routeType] ?? context.routeType;
  const stack = typeof e?.stack === "string" ? e.stack.split("\n").slice(1, 9).join("\n") : "";
  await raiseAlert({
    level: OLD_ACTION.test(message) ? "info" : "critical",
    kind: "server",
    title: OLD_ACTION.test(message) ? "An old browser tab used a form of the previous version" : `Server error in a ${where}`,
    // labelled lines: the admin's "Copy for AI" button (lib/alert-report.ts) hands this text to an AI, so it says where the error is
    detail: [
      `${typeof e?.name === "string" ? e.name : "Error"}: ${message}`,
      `Route (page file location): ${context.routePath} [${where}, router ${context.routerKind}]`,
      `Request: ${request.method} ${path}`,
      context.renderSource && `Render source: ${context.renderSource}`,
      digest && `Digest: ${digest}`,
      stack && `Stack trace (top frames):\n${stack}`,
    ]
      .filter(Boolean)
      .join("\n"),
    path,
  });
};
