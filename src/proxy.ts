import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session-token";
import { VIEW_COOKIE, mobilePathFor, wantsMobile } from "@/lib/device";
import { shield, takeAlerts } from "@/lib/shield";

// 0) The shield: hacking tools, attack text in the address and floods are answered here, before any page runs (src/lib/shield.ts).
// 1) First line of defence for /admin. Pages and server actions re-check with requireAdmin().
// 2) Device routing: a phone or tablet that asks for a page which has a mobile version is served /m/<page> (a rewrite: the address in the
//    browser does not change). Everything else is untouched. See src/lib/device.ts and brain/03-architecture.md.
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const stop = shield(pathname, request.nextUrl.search, request.headers.get("user-agent") ?? "", ip);
  const alerts = takeAlerts();
  if (alerts.length) event.waitUntil(import("@/lib/alerts").then(({ raiseAlert }) => Promise.all(alerts.map((a) => raiseAlert(a)))).catch(() => undefined));
  if (stop) {
    const headers: Record<string, string> = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
    if (stop.retryAfter) headers["Retry-After"] = String(stop.retryAfter);
    return new NextResponse(stop.text, { status: stop.status, headers });
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    let userId: string | null = null;
    try {
      userId = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    } catch {
      // SESSION_SECRET not configured: nobody can be logged in.
    }
    if (!userId) {
      // the page the admin wanted comes back after the login (the OAuth consent screen of Admin > AI Integrations needs it)
      const login = new URL("/admin/login", request.url);
      if (pathname !== "/admin") login.searchParams.set("next", pathname + request.nextUrl.search);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  // only plain page requests are rewritten (a server action is a POST to the page and must reach the same page)
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();
  if (pathname === "/m" || pathname.startsWith("/m/") || pathname.startsWith("/preview")) return NextResponse.next();

  // ?view=desktop or ?view=mobile: the visitor chooses by hand (remembered in a cookie)
  const asked = request.nextUrl.searchParams.get("view");
  // (a saved "mobile" choice is not kept for a real desktop browser: a laptop must not get the phone app because of an old ?view=mobile; the browser says it is a desktop with Sec-CH-UA-Mobile ?0 and a desktop platform)
  const saved = request.cookies.get(VIEW_COOKIE)?.value;
  const platform = request.headers.get("sec-ch-ua-platform") ?? "";
  const desktopBrowser = request.headers.get("sec-ch-ua-mobile") === "?0" && /Windows|macOS|Linux|Chrome OS/i.test(platform);
  const choice = asked === "desktop" || asked === "mobile" ? asked : saved === "mobile" && desktopBrowser ? undefined : saved;

  const target = wantsMobile(request.headers, choice) ? mobilePathFor(pathname) : null;
  let res: NextResponse;
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    res = NextResponse.rewrite(url);
  } else {
    res = NextResponse.next();
  }
  // "desktop" is remembered for 30 days; "mobile" only until the browser is closed
  if (asked === "desktop") res.cookies.set(VIEW_COOKIE, asked, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  else if (asked === "mobile") res.cookies.set(VIEW_COOKIE, asked, { path: "/", sameSite: "lax" });
  // the same address gives a different page to a phone and to a laptop: caches (CDN, Google) must know
  res.headers.set("Vary", "User-Agent, Sec-CH-UA-Mobile, Sec-CH-UA-Platform");
  // a page that has a phone twin is NOT kept in a shared cache (a CDN that ignores Vary would give the phone page to a laptop, and the laptop page to a phone)
  if (mobilePathFor(pathname)) res.headers.set("Cache-Control", "private, no-cache, must-revalidate");
  return res;
}

// admin + page requests; not the Next.js internals, the API, uploaded media or any file with an extension (images, fonts, scripts…),
// except the addresses that hacking tools try (/.env, /.git/config, /wp-login.php …): those reach the shield
export const config = {
  matcher: [
    "/((?!_next/|api/|media/|.*\\..*).*)",
    "/((?:.*/)?\\.(?:env|git|svn|hg|htaccess|htpasswd|aws|ssh|DS_Store)(?:[/.].*)?)",
    "/(.*\\.(?:php\\d?|aspx?|jsp|cgi|pl|env|ini|sql|bak|old|swp|sh|cfg|conf|log|ya?ml)(?:[/.].*)?)",
  ],
};
