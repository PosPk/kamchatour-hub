import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';

export const metadata = {
  title: 'TourHab — Камчатка',
  description: 'Туры по Камчатке. Поиск, партнёры, витрины.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        {/* Yandex.Metrika */}
        <Script id="ym-tag" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=104238894', 'ym');
          ym(104238894, 'init', { ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true });
        ` }} />
        <Script id="jsonld-organization" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Kamchatour Hub",
          "url": "https://new-web.vercel.app/",
          "logo": "/favicon.ico",
          "sameAs": ["https://t.me/KamchatourHub_bot"]
        }) }} />
        <Script id="jsonld-website" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Kamchatour Hub",
          "url": "https://new-web.vercel.app/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://new-web.vercel.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }) }} />
      </head>
      <body>
        <noscript>
          <div><img src="https://mc.yandex.ru/watch/104238894" style={{position:'absolute', left:-9999}} alt="" /></div>
        </noscript>
        {children}
      </body>
    </html>
  );
}

