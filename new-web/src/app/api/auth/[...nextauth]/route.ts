import NextAuth from "next-auth";
import Yandex from "next-auth/providers/yandex";

export const { handlers: { GET, POST } } = NextAuth({
  providers: [
    Yandex({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
});

