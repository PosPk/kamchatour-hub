import { NextRequest, NextResponse } from 'next/server'

// Simple proxy to v0 API (no CORS leakage of API key)
// Env:
// - V0_API_KEY (required)
// - V0_API_URL (optional, defaults to https://api.v0.dev/generate)

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.V0_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'V0_API_KEY not configured' }, { status: 500 })
    }
    const baseUrl = process.env.V0_API_URL || 'https://api.v0.dev/generate'
    const body = await req.json().catch(() => ({}))

    const upstream = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    const text = await upstream.text()
    const res = new NextResponse(text, { status: upstream.status })
    res.headers.set('content-type', upstream.headers.get('content-type') || 'application/json')
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch {
    return NextResponse.json({ error: 'v0 proxy failed' }, { status: 500 })
  }
}

