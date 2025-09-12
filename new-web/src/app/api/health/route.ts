import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const body = {
    ok: true,
    service: "new-web",
    now: new Date().toISOString(),
  };
  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}

