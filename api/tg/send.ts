import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'method not allowed' })
      return
    }

    const sendSecret = process.env.TELEGRAM_SEND_SECRET || ''
    const provided = (req.headers['x-tg-send-secret'] as string) || ''
    if (!sendSecret || provided !== sendSecret) {
      res.status(401).json({ ok: false, error: 'unauthorized' })
      return
    }

    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      res.status(500).json({ ok: false, error: 'bot token missing' })
      return
    }

    const { chat_id, text, parse_mode } = (req.body || {}) as {
      chat_id?: string | number
      text?: string
      parse_mode?: string
    }

    if (!chat_id || !text) {
      res.status(400).json({ ok: false, error: 'chat_id and text are required' })
      return
    }

    const form = new URLSearchParams()
    form.set('chat_id', String(chat_id))
    form.set('text', String(text))
    if (parse_mode) form.set('parse_mode', String(parse_mode))

    const upstream = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form,
    })

    const result = await upstream.json().catch(async () => ({ ok: false, status: upstream.status, text: await upstream.text() }))
    res.status(upstream.ok ? 200 : upstream.status).json(result)
  } catch (e) {
    res.status(500).json({ ok: false, error: 'send failed' })
  }
}

