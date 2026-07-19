import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/tokenAndCookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ─── Only care about /admin routes ──────────────────────────────────────
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = verifyToken(request);

  // Can't decode OR isAdmin is not true → show 404
  if (!user || user.isAdmin !== true) {
    /** Return the Next.js built-in not-found page without changing the URL */
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }

  // ✅ Verified admin → allow the request through
  return NextResponse.next();
}

/** Only run this proxy on /admin and its sub-routes */
export const config = {
  matcher: ["/admin/:path*"],
};
