"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="grid gap-4">
      <div className="text-xl font-extrabold">Вход</div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="h-11 rounded-xl px-3 text-slate-900" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль" type="password" className="h-11 rounded-xl px-3 text-slate-900" />
      <button onClick={()=>{ if (!email || !password) { setError('Заполните email и пароль'); return; } window.location.href = '/hub/owner/dashboard'; }} className="h-11 rounded-xl bg-premium-gold text-premium-black font-bold">Войти</button>
      <div className="text-sm text-white/70">Нет аккаунта? <Link href="/hub/owner/auth/signup" className="text-premium-gold hover:underline">Зарегистрируйтесь</Link></div>
    </div>
  );
}

