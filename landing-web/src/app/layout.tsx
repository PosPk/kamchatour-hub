import './globals.css';
import type { ReactNode } from 'react';

export const metadata = { title: 'Kamchatour — Landing', description: 'Главная лэндинг-страница' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

