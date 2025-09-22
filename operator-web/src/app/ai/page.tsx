"use client";
import { useState } from 'react';

export default function AIPage() {
  const [prompt, setPrompt] = useState("Сгенерируй SEO‑описание тура по Камчатке на 2 абзаца");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  async function onGenerate() {
    setLoading(true);
    setContent("");
    const res = await fetch('/api/ai/proxy', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (data?.ok) setContent(data.content || ""); else setContent("Ошибка: " + (data?.error || res.status));
  }

  return (
    <main style={{ padding: 24, display: 'grid', gap: 12 }}>
      <h1>AI (Groq)</h1>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={6} style={{ padding: 12, borderRadius: 10, width: '100%' }} />
      <button disabled={loading} onClick={onGenerate} style={{ width: 'fit-content', padding: '10px 14px', borderRadius: 10 }}>
        {loading ? 'Генерация…' : 'Сгенерировать'}
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#F8FAFD', padding: 12, borderRadius: 10 }}>{content}</pre>
    </main>
  );
}

