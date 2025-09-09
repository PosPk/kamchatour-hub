export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white/70 dark:bg-black/20 backdrop-blur">
      <div className="container mx-auto px-6 py-10 text-sm text-slate-600 dark:text-slate-300 flex flex-col md:flex-row gap-6 md:gap-0 justify-between">
        <div>
          <div className="font-extrabold text-slate-900 dark:text-white">Kamchatka Hub</div>
          <div className="mt-2">© {new Date().getFullYear()} Все права защищены</div>
        </div>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-slate-900 dark:hover:text-white">Конфиденциальность</a>
          <a href="/terms" className="hover:text-slate-900 dark:hover:text-white">Условия</a>
          <a href="/contacts" className="hover:text-slate-900 dark:hover:text-white">Контакты</a>
        </div>
      </div>
    </footer>
  );
}

