import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const expected = process.env.TELEGRAM_WEBHOOK_SECRET || ''
    const got = req.headers.get('x-telegram-bot-api-secret-token') || ''
    if (!expected || got !== expected) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }

    // Minimal handler: /status responds with app status
    const body = await req.json().catch(() => ({})) as unknown as {
      message?: { text?: string; chat?: { id?: number } }
      callback_query?: { message?: { chat?: { id?: number } } }
    }
    const text = body?.message?.text?.trim() || ''
    const chatId = body?.message?.chat?.id || body?.callback_query?.message?.chat?.id

    if (text.startsWith('/status') && chatId) {
      const parts: string[] = []
      const has = (k: string) => (process.env[k] ? '✓' : '—')
      parts.push('Status:')
      parts.push(`Auth: NEXTAUTH_URL ${has('NEXTAUTH_URL')}, SECRET ${has('NEXTAUTH_SECRET')}`)
      parts.push(`Supabase: URL ${has('SUPABASE_URL')}, SRK ${has('SUPABASE_SERVICE_ROLE_KEY')}`)
      parts.push(`Payments: CloudPayments ${has('CLOUDPAYMENTS_PUBLIC_ID')}/${has('CLOUDPAYMENTS_API_SECRET')}`)
      parts.push(`Maps: JS ${has('NEXT_PUBLIC_YANDEX_MAPS_API_KEY')}, Server ${has('YANDEX_MAPS_API_KEY')}`)
      parts.push(`Telegram: BOT ${has('TELEGRAM_BOT_TOKEN')}, WEBHOOK_SECRET ${has('TELEGRAM_WEBHOOK_SECRET')}`)
      const msg = parts.join('\n')
      const token = process.env.TELEGRAM_BOT_TOKEN
      if (token) {
        // Fire-and-forget; do not block webhook
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ chat_id: String(chatId), text: msg })
        }).catch(() => {})
      }
      return NextResponse.json({ ok: true, sent: Boolean(token) })
    }

    if (text.startsWith('/todo') && chatId) {
      const token = process.env.TELEGRAM_BOT_TOKEN
      const reply = 'Задача зафиксирована. (демо)'
      if (token) {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ chat_id: String(chatId), text: reply })
        }).catch(() => {})
      }
      return NextResponse.json({ ok: true })
    }

    if (text.startsWith('/assign') && chatId) {
      const token = process.env.TELEGRAM_BOT_TOKEN
      const reply = 'Назначение выполнено. (демо)'
      if (token) {
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ chat_id: String(chatId), text: reply })
        }).catch(() => {})
      }
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true, received: true, ignored: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'webhook failed' }, { status: 500 })
  }
}

