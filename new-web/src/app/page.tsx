import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tours = [
  { id: "1", title: "Вулканы Камчатки", price: 35000, days: 3, image: "/hero.jpg" },
  { id: "2", title: "Медведи и сёрф", price: 42000, days: 4, image: "/hero.jpg" },
  { id: "3", title: "Ледяные пещеры", price: 39000, days: 2, image: "/hero.jpg" },
  { id: "4", title: "Вертолёт на Плоский Толбачик", price: 120000, days: 1, image: "/hero.jpg" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
          <Image src="/hero.jpg" alt="Kamchatka" fill priority className="object-cover opacity-20" />
          <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/20 via-sky-300/30 to-violet-300/30 blur-3xl" />
        </div>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <Badge className="mb-4 glass">Kamchatka Hub</Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="text-gradient">Камчатка</span>. Приключение, о котором хочется рассказывать
            </h1>
            <p className="mt-5 text-lg md:text-xl text-slate-600 dark:text-slate-300">
              Премиальные туры от сертифицированных операторов. Прозрачные цены. Бронирование за 60 секунд.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="shadow-lg shadow-primary/20">Выбрать тур</Button>
              <Button size="lg" variant="outline" className="backdrop-blur">Для операторов</Button>
            </div>
            <div className="mt-8 flex items-center gap-6 opacity-80">
              <Image src="/vercel.svg" alt="Vercel" width={80} height={18} />
              <Image src="/next.svg" alt="Next" width={80} height={18} />
              <Image src="/window.svg" alt="Edge" width={80} height={18} />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Популярные туры</h2>
          <Button variant="ghost">Все туры</Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tours.map(t => (
            <Card key={t.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200/60">
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-44 mb-3 rounded-xl overflow-hidden bg-slate-100">
                  <Image src={t.image} alt={t.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-slate-900 dark:text-white font-bold">{t.price.toLocaleString('ru-RU')} ₽</div>
                  <div className="text-slate-500 text-sm">{t.days} дн.</div>
                </div>
                <Button className="w-full mt-4">Забронировать</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
