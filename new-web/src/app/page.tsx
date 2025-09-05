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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="/hero.jpg" alt="Kamchatka" fill priority className="object-cover opacity-20" />
        </div>
        <div className="container mx-auto px-6 py-28">
          <div className="max-w-3xl">
            <Badge className="mb-4">Kamchatka Hub</Badge>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Камчатка. Приключение, о котором хочется рассказывать
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Туры от проверенных операторов. Быстрые бронирования. Поддержка 24/7.
            </p>
            <div className="mt-8 flex gap-3">
              <Button size="lg">Выбрать тур</Button>
              <Button size="lg" variant="outline">Для операторов</Button>
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
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden bg-slate-100">
                  <Image src={t.image} alt={t.title} fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-slate-900 font-bold">{t.price.toLocaleString('ru-RU')} ₽</div>
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
