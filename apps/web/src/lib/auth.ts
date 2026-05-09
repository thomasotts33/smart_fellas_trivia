import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    session({ session }) {
      return session;
    },
  },
};
