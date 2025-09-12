"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  className?: string;
  children: React.ReactNode;
  delayMs?: number;
};

export function Reveal({ className = "", children, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delayMs > 0) {
              setTimeout(() => el.setAttribute("data-inview", "true"), delayMs);
            } else {
              el.setAttribute("data-inview", "true");
            }
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </div>
  );
}

