import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/api/:path*'],
};

export default function middleware(req: NextRequest) {
  const requiredKey = process.env.AI_GATEWAY_API_KEY;
  if (!requiredKey) return NextResponse.next();

  const provided = req.headers.get('x-api-key') || '';
  if (provided !== requiredKey) {
    return new NextResponse(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return NextResponse.next();
}

