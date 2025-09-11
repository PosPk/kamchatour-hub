import NextAuth from "next-auth";
import Yandex from "next-auth/providers/yandex";

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
export { handler as GET, handler as POST };

