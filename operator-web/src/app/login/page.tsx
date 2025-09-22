"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError('Введите e-mail и пароль'); return; }
    sessionStorage.setItem('op-auth', JSON.stringify({ email, ts: Date.now() }));
    router.push('/dashboard');
  }

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1>Вход</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
        {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        <button type="submit">Войти</button>
      </form>
    </main>
  );
}