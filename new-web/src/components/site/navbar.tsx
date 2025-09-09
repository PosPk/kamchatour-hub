"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          PlanB
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium">Туры</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 gap-4 p-6">
                  <MegaLink href="#" title="Популярные" description="Самые бронируемые направления" />
                  <MegaLink href="#" title="Выходного дня" description="1–3 дня лёгкие маршруты" />
                  <MegaLink href="#" title="Семейные" description="Комфорт и дети 6+" />
                  <MegaLink href="#" title="Экстрим" description="Хайкинг, восхождения, 4x4" />
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-medium">Операторы</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[600px] p-6 grid grid-cols-2 gap-4">
                  <MegaLink href="#" title="По рейтингу" description="Надёжные партнёры" />
                  <MegaLink href="#" title="По регионам" description="Где они работают" />
                  <MegaLink href="#" title="Преимущества" description="Почему бронируют у нас" />
                  <MegaLink href="#" title="Сертификаты" description="Лицензии, страховки" />
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="#about" legacyBehavior passHref>
                <NavigationMenuLink className="px-3 py-2 rounded-md hover:bg-muted transition-colors font-medium">
                  О нас
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="#tours" className="text-sm font-medium hover:underline">
            Каталог
          </Link>
          <Link href="#book" className="inline-flex h-9 items-center rounded-md bg-foreground text-background px-4 text-sm font-medium hover:opacity-90">
            Забронировать
          </Link>
        </div>
      </div>
    </header>
  );
}

function MegaLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-border/60 p-4 hover:bg-muted transition-colors"
    >
      <div className="font-semibold tracking-tight group-hover:underline">
        {title}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{description}</div>
    </Link>
  );
}

