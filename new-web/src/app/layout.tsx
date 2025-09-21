import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'TourHab — Камчатка',
  description: 'Туры по Камчатке. Поиск, партнёры, витрины.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

