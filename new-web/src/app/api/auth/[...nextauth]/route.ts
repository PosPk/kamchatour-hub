import NextAuth from "next-auth";
import Yandex from "next-auth/providers/yandex";
import type { NextRequest } from "next/server";

export const authOptions = {
  providers: [
    Yandex({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
  ],
  pages: {},
  callbacks: {},
  session: { strategy: "jwt" as const },
};

const handler = NextAuth(authOptions);
export const GET = (req: NextRequest, ctx: any) => handler(req as any, ctx as any);
export const POST = (req: NextRequest, ctx: any) => handler(req as any, ctx as any);

