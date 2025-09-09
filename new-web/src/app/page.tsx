import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { TourCard } from "@/components/site/tour-card";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <Hero />
        <section id="tours" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TourCard title="Алтай. Мультинские озёра" days={5} price="от 38 000₽" image="/images/sample-1.jpg" badges={["топ", "легко"]} />
          <TourCard title="Кольский. Териберка" days={3} price="от 29 000₽" image="/images/sample-2.jpg" badges={["север", "фото"]} />
          <TourCard title="Дагестан. Сулакский каньон" days={4} price="от 32 000₽" image="/images/sample-3.jpg" badges={["юг", "джип"]} />
        </section>
      </main>
      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">© PlanB</footer>
    </div>
  );
}
