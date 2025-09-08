import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = { matcher: ['/api/:path*'] };

export default function middleware(req: NextRequest) {
  // Temporary bypass: enforce only if explicitly enabled
  const enforce = process.env.AI_GATEWAY_ENFORCE === 'true';
  if (!enforce) return NextResponse.next();

  // Always allow basic health/env endpoints without key
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/health') || url.pathname.startsWith('/api/env')) {
    return NextResponse.next();
  }

  const requiredKey = process.env.AI_GATEWAY_API_KEY || '';
  const provided = req.headers.get('x-api-key') || '';
  if (!requiredKey || provided !== requiredKey) {
    return new NextResponse(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return NextResponse.next();
}

