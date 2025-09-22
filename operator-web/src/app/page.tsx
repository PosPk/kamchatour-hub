import Link from 'next/link';

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Operator Portal</h1>
      <p>Войдите в систему для доступа к CRM и календарю бронирований.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/login">Вход</Link>
        <Link href="/dashboard">Дашборд</Link>
      </div>
    </main>
  );
}