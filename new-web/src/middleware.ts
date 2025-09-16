import type { NextRequest } from "next/server";

const BYPASS_PATHS = ["/api/health", "/api/env", "/api/auth", "/_next", "/favicon.ico"];

export const config = {
  matcher: "/:path*",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (BYPASS_PATHS.some((p) => pathname.startsWith(p))) {
    return;
  }
  const enforce = process.env.AI_GATEWAY_ENFORCE === "true";
  if (!enforce) return;
  const apiKey = req.headers.get("x-api-key") || "";
  const expected = process.env.AI_GATEWAY_API_KEY || "";
  if (expected && apiKey === expected) return;
  return new Response("Unauthorized", { status: 401 });
}

