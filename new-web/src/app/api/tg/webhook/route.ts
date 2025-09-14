import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const expected = process.env.TELEGRAM_WEBHOOK_SECRET || ''
    const got = req.headers.get('x-telegram-bot-api-secret-token') || ''
    if (!expected || got !== expected) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }

    // Minimal echo/help for smoke
    const body = await req.json().catch(() => ({})) as unknown as { message?: { text?: string; chat?: { id?: number } } }
    const text = body?.message?.text || ''
    const replyNeeded = Boolean(text)

    return NextResponse.json({ ok: true, received: true, replyPlanned: replyNeeded })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'webhook failed' }, { status: 500 })
  }
}

