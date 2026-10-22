import "server-only";
import type { SiteAlert } from "@/lib/alerts";
import { db, hasDb } from "@/lib/db";

// "Check again" on Admin > Alerts: tries the thing that failed once more and says whether it still fails.
//   fixed   = it works now (the page answers normally / the database answers)
//   still   = it fails again (same kind of error)
//   unknown = this kind of alert cannot be tested from the server (an attack that was blocked, an error in a visitor's browser, a form that was
//             sent); the admin decides and can still press "Solved"
export type AlertCheck = { state: "fixed" | "still" | "unknown"; message: string };

/** The page address of the alert, only when it is a safe path of this website (never another site, never "//host"). */
function safePath(path: string): string | null {
  return /^\/(?!\/)[\w\-./~%[\]()@:+,=&?]*$/.test(path) && !path.includes("..") ? path : null;
}

/** GET unless the alert says another method (older alerts keep it as the first word of a detail line, e.g. "GET /about") */
function methodOf(a: SiteAlert): string {
  const m = /(?:^|\n)(?:Request: )?(GET|POST|PUT|PATCH|DELETE)\s/.exec(a.detail);
  return m ? m[1] : "GET";
}

export async function checkAlert(a: SiteAlert, origin: string, cookie: string): Promise<AlertCheck> {
  // a failed save: ask the database
  if (a.kind === "save") {
    if (!hasDb) return { state: "unknown", message: "No database is connected here, so a save cannot be tested." };
    try {
      await db.$queryRaw`SELECT 1`;
      return { state: "fixed", message: "The database answers normally now. A save that failed earlier is not tested again (it would repeat the action): if you know the cause is gone, press Solved." };
    } catch (error) {
      return { state: "still", message: `The database does not answer: ${error instanceof Error ? error.message.slice(0, 160) : "unknown error"}` };
    }
  }

  // a server error or an error of a page: open the page again
  if (a.kind === "server" || a.kind === "browser") {
    const path = safePath(a.path);
    if (!path) return { state: "unknown", message: "This alert has no page address, so there is nothing to open again." };
    if (a.kind === "server" && methodOf(a) !== "GET") {
      return { state: "unknown", message: "The error came from a form or action (not from opening a page). It cannot be repeated safely from here: try the form once yourself, then press Solved." };
    }
    try {
      const res = await fetch(origin + path, { headers: { cookie, "user-agent": "We3vision-alert-check" }, redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(20_000) });
      const redirected = res.status >= 300 && res.status < 400;
      if (res.status >= 500) return { state: "still", message: `The page still fails: the server answered ${res.status}.` };
      if (res.status === 404) return { state: "still", message: "The page answers 404 (not found). Check that the address is right." };
      if (a.kind === "browser") {
        return { state: "unknown", message: `The page opens (${res.status}). This error happens inside a visitor's browser, so a server cannot repeat it: open the page, look, and press Solved if it is fine.` };
      }
      return { state: "fixed", message: redirected ? `The page answers with a redirect (${res.status}) and no error.` : `The page opens normally now (${res.status}). The error did not come back.` };
    } catch (error) {
      return { state: "still", message: `The page could not be opened: ${error instanceof Error ? error.message.slice(0, 160) : "no answer"}.` };
    }
  }

  return { state: "unknown", message: "This kind of alert (a blocked attack, a limit or an activity note) cannot be tested again. If you have looked at it, press Solved." };
}
