import dynamic from 'next/dynamic';

export default function SafetyHub() {
  const BearMap = dynamic(() => import('../../components/BearMap'), { ssr: false });
  return (
    <main className="min-h-screen bg-premium-black text-white px-6 py-8 grid gap-6">
      <h1 className="text-3xl font-extrabold">Безопасность и карта медведей</h1>
      <p className="text-white/80">Здесь будет полный экран карты с наблюдениями и фильтрами.</p>
      <BearMap showPoints />
    </main>
  );
}

