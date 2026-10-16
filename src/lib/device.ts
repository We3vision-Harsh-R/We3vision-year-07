// DEVICE ROUTING. A phone or tablet gets the separate mobile site (src/app/(m)/m/...), a laptop gets the desktop site (src/app/(site)/...).
// The visitor always sees the SAME address (we3vision.com/seo); src/proxy.ts rewrites it inside the server, so there is one URL for SEO and a phone
// never downloads the desktop code. Keep this file free of server-only imports (the proxy uses it).

/** cookie that lets a visitor choose a view by hand: "desktop" or "mobile" (set with ?view=desktop / ?view=mobile) */
export const VIEW_COOKIE = "we3.view";

/**
 * The pages that already have a mobile version, as public addresses. A phone gets /m<path> for these. Every other page still shows the
 * desktop page, so nothing breaks while the mobile site grows. When a new mobile page is ready, add its address here.
 */
export const MOBILE_READY: ReadonlySet<string> = new Set(["/"]);

const MOBILE_UA = /Android|iPhone|iPad|iPod|Mobile|Windows Phone|IEMobile|Opera Mini|BlackBerry|webOS/i;

/** true for a phone or tablet. The visitor's own choice (cookie) wins; then the browser hint; then the User-Agent text. */
export function wantsMobile(headers: Headers, view?: string): boolean {
  if (view === "mobile") return true;
  if (view === "desktop") return false;
  if (headers.get("sec-ch-ua-mobile") === "?1") return true;
  return MOBILE_UA.test(headers.get("user-agent") ?? "");
}

/** the internal address of the mobile version of a public page, or null when that page has no mobile version yet */
export function mobilePathFor(pathname: string): string | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (!MOBILE_READY.has(clean)) return null;
  return clean === "/" ? "/m" : `/m${clean}`;
}
