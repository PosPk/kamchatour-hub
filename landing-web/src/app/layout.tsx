import './globals.css';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display, Bebas_Neue } from 'next/font/google';

export const metadata = { title: 'Kamchatour — Landing', description: 'Главная лэндинг-страница' };

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${playfair.variable} ${bebas.variable} font-sans`}>{children}</body>
    </html>
  );
}

