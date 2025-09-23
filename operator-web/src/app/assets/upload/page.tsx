"use client";
import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState("");
  const [contentType, setContentType] = useState("image/jpeg");
  const [msg, setMsg] = useState("");

  async function onUpload() {
    try {
      if (!file || !key) { setMsg('Выберите файл и укажите ключ (путь в бакете)'); return; }
      const form = new FormData();
      form.append('key', key);
      form.append('file', file);
      const res = await fetch('/api/assets/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) { setMsg('Ошибка: ' + (data.error || res.status)); return; }
      setMsg('Загружено: s3://' + data.key);
    } catch (e) {
      setMsg('Ошибка: ' + String(e));
    }
  }

  return (
    <main style={{ padding: 24, display: 'grid', gap: 12 }}>
      <h1>Загрузка медиа</h1>
      <input type="text" placeholder="partners/kr/logo.svg или tours/kr-001/1.jpg" value={key} onChange={e => setKey(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={onUpload}>Загрузить</button>
      {msg && <div>{msg}</div>}
      <hr />
      <p>Советы:</p>
      <ul>
        <li>Лого партнёров: partners/&lt;slug&gt;/logo.svg/png</li>
        <li>Фото тура: tours/&lt;slug&gt;/&lt;id&gt;/&lt;N&gt;.jpg</li>
      </ul>
    </main>
  );
}

