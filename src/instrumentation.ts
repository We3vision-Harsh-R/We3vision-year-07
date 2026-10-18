import type { Instrumentation } from "next";

// Next.js calls onRequestError for every error of the server: a page that crashes, an API route, a server action, the proxy.
// Each one becomes a critical alert (Admin > Alerts + WhatsApp, see lib/alerts.ts). Normal control flow is skipped:
// redirect(), notFound(), a visitor who closed the page, an old browser tab that calls a server action of the previous build.
const SKIP_DIGEST = /^(?:NEXT_REDIRECT|NEXT_HTTP_ERROR_FALLBACK|NEXT_NOT_FOUND|DYNAMIC_SERVER_USAGE|BAILOUT_TO_CLIENT_SIDE_RENDERING|HANGING_PROMISE_REJECTION)/;
const SKIP_MESSAGE = /aborted|ECONNRESET|EPIPE|socket hang up/i;
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
  const stack = typeof e?.stack === "string" ? e.stack.split("\n").slice(1, 4).join("\n") : "";
  await raiseAlert({
    level: OLD_ACTION.test(message) ? "info" : "critical",
    kind: "server",
    title: OLD_ACTION.test(message) ? "An old browser tab used a form of the previous version" : `Server error in a ${where}`,
    detail: [`${typeof e?.name === "string" ? e.name : "Error"}: ${message}`, digest && `digest ${digest}`, `${request.method} ${context.routePath}`, stack].filter(Boolean).join("\n"),
    path,
  });
};
