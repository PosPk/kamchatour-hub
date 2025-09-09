"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRef } from "react";

export type TourCardProps = {
  title: string;
  days: number;
  price: string;
  image: string;
  badges?: string[];
};

export function TourCard({ title, days, price, image, badges = [] }: TourCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Card
      ref={ref}
      className="group overflow-hidden border-border/60 transition-transform will-change-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center justify-between">
          <span className="truncate max-w-[70%]">{title}</span>
          <span className="text-base font-semibold">{price}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{days} дн.</span>
        </div>
        <div className="flex gap-1">
          {badges.slice(0, 3).map((b) => (
            <Badge key={b} variant="secondary" className="text-xs">
              {b}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

