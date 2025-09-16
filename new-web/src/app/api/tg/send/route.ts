import { NextRequest, NextResponse } from 'next/server'

type SendBody = {
  chat_id?: string | number
  text?: string
  parse_mode?: string
}

export async function POST(req: NextRequest) {
  try {
    const sendSecret = process.env.TELEGRAM_SEND_SECRET || ''
    const provided = req.headers.get('x-tg-send-secret') || ''
    if (!sendSecret || provided !== sendSecret) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }

    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      return NextResponse.json({ ok: false, error: 'bot token missing' }, { status: 500 })
    }

    const body = (await req.json().catch(() => ({}))) as SendBody
    const chatId = body.chat_id
    const text = body.text
    const parseMode = body.parse_mode
    if (!chatId || !text) {
      return NextResponse.json({ ok: false, error: 'chat_id and text are required' }, { status: 400 })
    }

    const form = new URLSearchParams()
    form.set('chat_id', String(chatId))
    form.set('text', String(text))
    if (parseMode) form.set('parse_mode', String(parseMode))

    const upstream = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form,
    })

    const resultText = await upstream.text()
    const res = new NextResponse(resultText, { status: upstream.status })
    res.headers.set('content-type', upstream.headers.get('content-type') || 'application/json')
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch {
    return NextResponse.json({ ok: false, error: 'send failed' }, { status: 500 })
  }
}

