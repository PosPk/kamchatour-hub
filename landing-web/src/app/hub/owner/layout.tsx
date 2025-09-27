export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-premium-black text-white">
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="text-xl font-extrabold">Личный кабинет арендодателя</div>
        <nav className="flex gap-4 text-sm">
          <a href="/hub/owner/dashboard" className="hover:underline">Дашборд</a>
          <a href="/hub/owner/properties" className="hover:underline">Мои объекты</a>
          <a href="/hub/owner/properties/add" className="hover:underline">Добавить объект</a>
        </nav>
      </header>
      <main className="px-6 py-6 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}

