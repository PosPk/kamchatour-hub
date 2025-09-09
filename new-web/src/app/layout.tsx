import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  title: "Kamchatka Hub — Ваше приключение начинается здесь",
  description: "Лучшие туры Камчатки: вулканы, медведи, океан. Бронирование онлайн.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://preview-kamchatka.vercel.app"),
  openGraph: {
    title: "Kamchatka Hub",
    description: "Лучшие туры Камчатки",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} min-h-screen bg-radial`}>
        <Navbar />
        <div className="relative">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
