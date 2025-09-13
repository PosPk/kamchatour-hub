'use client'

import { useEffect, useRef, useState } from 'react'

type YMaps = {
  ready: (cb: () => void) => void
  Map: new (el: HTMLElement | null, opts: { center: [number, number]; zoom: number }) => unknown
  control: { SearchControl: new (opts: Record<string, unknown>) => unknown }
}

declare global {
  interface Window { ymaps: YMaps }
}

export default function MapsPage() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY
    if (!apiKey) {
      setError('NEXT_PUBLIC_YANDEX_MAPS_API_KEY not configured')
      return
    }
    // Inject Yandex Maps JS
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
    script.async = true
    script.onload = () => {
      if (!window.ymaps) { setError('ymaps failed to load'); return }
      window.ymaps.ready(() => {
        try {
          const map = new window.ymaps.Map(mapRef.current, { center: [53.01, 158.65], zoom: 9 }) as any
          const control = new window.ymaps.control.SearchControl({ provider: 'yandex#search' }) as any
          // @ts-expect-error Yandex Maps typings are not available in this project
          map.controls.add(control)
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'map init failed'
          setError(message)
        }
      })
    }
    script.onerror = () => setError('Yandex Maps script load error')
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      <h1>Карта (Yandex Maps)</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div ref={mapRef} style={{ width: '100%', height: '70vh', borderRadius: 12, overflow: 'hidden', background: '#f2f2f2' }} />
      <p style={{ fontSize: 12, color: '#666' }}>Серверный геокодер: /api/geocoder?geocode=Петропавловск-Камчатский</p>
    </div>
  )
}

