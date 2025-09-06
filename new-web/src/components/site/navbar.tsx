"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight text-slate-900">Kamchatka Hub</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/tours" className="hover:text-slate-900">Туры</Link>
          <Link href="/operators" className="hover:text-slate-900">Операторы</Link>
          <Link href="/about" className="hover:text-slate-900">О нас</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Войти</Link>
          </Button>
          <Button asChild>
            <Link href="/tours">Выбрать тур</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

