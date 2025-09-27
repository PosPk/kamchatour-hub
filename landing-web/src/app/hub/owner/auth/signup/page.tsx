"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="grid gap-4">
      <div className="text-xl font-extrabold">Регистрация</div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Имя" className="h-11 rounded-xl px-3 text-slate-900" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="h-11 rounded-xl px-3 text-slate-900" />
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Телефон" className="h-11 rounded-xl px-3 text-slate-900" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль" type="password" className="h-11 rounded-xl px-3 text-slate-900" />
      <input value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Повторите пароль" type="password" className="h-11 rounded-xl px-3 text-slate-900" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} /> Согласен с правилами</label>
      <button onClick={()=>{ if (!email || !password || password!==confirm || !agree) { setError('Проверьте поля и согласие'); return; } window.location.href = '/hub/owner/dashboard'; }} className="h-11 rounded-xl bg-premium-gold text-premium-black font-bold">Создать аккаунт</button>
      <div className="text-sm text-white/70">Уже есть аккаунт? <Link href="/hub/owner/auth/signin" className="text-premium-gold hover:underline">Войти</Link></div>
    </div>
  );
}

