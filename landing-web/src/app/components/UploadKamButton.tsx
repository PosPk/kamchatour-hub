"use client";

import { useState } from 'react';

export default function UploadKamButton({ onReady }: { onReady: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const local = URL.createObjectURL(file);
    setPreview(local);
    // Use local preview immediately as the button image
    try { onReady(local); } catch {}
    setError(null);
    setBusy(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('prefix', 'graphics/kamchatka-button');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'upload_failed');
      try {
        setServerUrl(data.url);
        onReady(data.url);
      } catch {}
    } catch (e: any) {
      setError(e?.message || 'Ошибка загрузки');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-2">
      <label className="text-xs text-white/60">PNG силуэт Камчатки</label>
      <input type="file" accept="image/png,image/svg+xml" onChange={onChange} className="text-sm" />
      {busy && <div className="text-xs text-white/60">Загрузка…</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
      {preview && (
        <div className="rounded-xl border border-white/10 bg-black p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Предпросмотр" className="max-h-48 mx-auto" />
        </div>
      )}
      {serverUrl && !busy && (
        <button
          onClick={async () => {
            try {
              setBusy(true);
              const res = await fetch('/api/kam-button', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: serverUrl }) });
              const j = await res.json();
              if (!res.ok) throw new Error(j?.error || 'save_failed');
              setSavedUrl(serverUrl);
            } catch (e:any) {
              setError(e?.message || 'Ошибка сохранения');
            } finally {
              setBusy(false);
            }
          }}
          className="h-10 rounded-lg bg-premium-gold text-premium-black font-semibold"
        >Сохранить</button>
      )}
      {savedUrl && <div className="text-xs text-green-400">Сохранено. Будет подставляться автоматически.</div>}
    </div>
  );
}

