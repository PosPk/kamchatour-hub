"use client";

import { useEffect, useState } from 'react';

export default function KamchatkaSvgButton({ href = '/hub/safety' }: { href?: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const staticFallback = '/graphics/kamchatka-button.svg';

  useEffect(() => { (async () => {
    try {
      if (typeof window !== 'undefined') {
        const ls = localStorage.getItem('kam_button_url');
        if (ls) setImgUrl(ls);
      }
      const conf = await fetch('/api/kam-button', { cache: 'no-store' });
      if (conf.ok) {
        const cj = await conf.json();
        const candidate = cj?.pinnedUrl || cj?.url;
        if (candidate) {
          setImgUrl(candidate);
          try { if (typeof window !== 'undefined') localStorage.setItem('kam_button_url', candidate); } catch {}
        }
      }
    } catch {}
  })(); }, []);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-block w-full max-w-[520px]">
      <div className="rounded-2xl border border-white/10 bg-black grid place-items-center map-button-glow w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgUrl || staticFallback} alt="Камчатка" className="kamchatka-button w-full h-auto" />
      </div>
    </a>
  );
}

