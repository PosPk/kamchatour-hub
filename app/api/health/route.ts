import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const version = (process as any)?.env?.npm_package_version || '0.0.0';
    const startedAt = Number((process as any)?.env?.BOOT_TIME_MS || Date.now());
    const uptimeMs = Date.now() - startedAt;
    return NextResponse.json({
      ok: true,
      service: 'kamchatour-hub',
      version,
      uptimeMs,
      env: {
        hasSupabase: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasPayments: Boolean(process.env.CLOUDPAYMENTS_PUBLIC_ID),
        aiProvider: process.env.AI_PROVIDER || 'openai',
      },
      now: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'health failed' }, { status: 500 });
  }
}

