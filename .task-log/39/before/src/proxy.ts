import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session-token";

// First line of defence for /admin. Pages and server actions re-check with requireAdmin().
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  let userId: string | null = null;
  try {
    userId = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    // SESSION_SECRET not configured: nobody can be logged in.
  }
  if (!userId) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
