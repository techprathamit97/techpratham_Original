import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * API access control.
 *
 * Goal: stop people opening endpoints like
 * https://www.techpratham.com/api/course/fetch directly in a browser, while
 * leaving every in-app request working exactly as before.
 *
 * How it distinguishes the two:
 *   - Typing a URL, clicking a link, or submitting a form is a *navigation*.
 *     Browsers set Sec-Fetch-Mode: navigate and Sec-Fetch-Dest: document on
 *     those, and page JavaScript cannot override either header.
 *   - fetch() from your own pages sends Sec-Fetch-Mode: cors or same-origin.
 *
 * So navigations to /api/* are rejected, and the application is untouched.
 *
 * LIMITS - read before relying on this:
 *   This does NOT stop a scripted client. curl can set any header it likes,
 *   including Sec-Fetch-Mode and Origin. Nothing shipped to a browser can
 *   prevent replay, because the client already has everything it needs.
 *   Real protection is per-endpoint authorisation based on the signed-in user
 *   (see lib/apiAuth.ts). This middleware raises the floor; it is not the wall.
 */

/** Paths that must keep working for navigations and cross-site posts. */
const BYPASS_PREFIXES = [
  // NextAuth's own endpoints. OAuth callbacks and sign-in redirects ARE
  // navigations, so blocking these breaks login entirely.
  "/api/auth",

  // Easebuzz submits a form from their payment page back to this endpoint.
  // That arrives as a cross-site navigation with a foreign Origin.
  "/api/easebuzz/payment-response",

  // pdf.js issues ranged requests, and the lead-gated download uses
  // window.open() which is a navigation.
  "/api/secure-pdf",
];

/** Methods that change state and therefore need an origin check. */
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function deny(message: string, status: number) {
  return NextResponse.json(
    { status: "error", message },
    {
      status,
      headers: {
        // Keep API responses out of search results.
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    }
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  /**
   * Escape hatch for debugging endpoints directly in a browser.
   *
   * Middleware runs on the edge runtime and cannot query MongoDB, and the
   * NextAuth session token carries no role (authOptions defines no jwt
   * callback), so a real "developer" role check is not possible here without
   * changing the auth configuration. A shared secret is used instead.
   *
   * Set API_DEV_SECRET in the environment, then either send the header
   * x-dev-access, or set a dev_access cookie to the same value. Leave
   * API_DEV_SECRET unset to disable the bypass completely.
   */
  const devSecret = process.env.API_DEV_SECRET;
  const presented =
    req.headers.get("x-dev-access") ?? req.cookies.get("dev_access")?.value;
  const isDeveloper = Boolean(devSecret) && presented === devSecret;

  if (isDeveloper) {
    return NextResponse.next();
  }

  // 1. Block direct browser navigation to API routes.
  const fetchMode = req.headers.get("sec-fetch-mode");
  const fetchDest = req.headers.get("sec-fetch-dest");

  if (fetchMode === "navigate" || fetchDest === "document") {
    return deny("This endpoint is not directly accessible.", 403);
  }

  // 2. Reject cross-origin writes. Only enforced when an Origin is present;
  //    same-origin GETs and server-to-server calls send none.
  if (WRITE_METHODS.has(req.method.toUpperCase())) {
    const origin = req.headers.get("origin");

    if (origin) {
      const allowed = new Set<string>([req.nextUrl.origin]);

      const configured = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");
      if (configured) {
        allowed.add(configured);
        // The site is reachable on both apex and www, so accept either form of
        // whichever one is configured.
        try {
          const url = new URL(configured);
          const host = url.host.replace(/^www\./, "");
          allowed.add(`${url.protocol}//${host}`);
          allowed.add(`${url.protocol}//www.${host}`);
        } catch {
          // Malformed NEXT_PUBLIC_BASE_URL; the nextUrl.origin entry still applies.
        }
      }

      if (!allowed.has(origin)) {
        return deny("Cross-origin requests are not permitted.", 403);
      }
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
