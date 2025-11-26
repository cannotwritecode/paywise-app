import { apiClient } from "@/src/lib/api";
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { type NextAuthOptions } from "next-auth";
import { z } from "zod";
import { type User } from "next-auth";

export const authOptions: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        try {
          // Use your centralized Axios API client
          const { data } = await apiClient.post("/auth/login", {
            email,
            password,
          });

          if (!data?.user || !data?.token) {
            return null;
          }

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            location: data.user.location,
            reputation: data.user.reputation,
            rewardsBalance: data.user.rewardsBalance,
            accessToken: data.token,
          };

          return user;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user: User;
      trigger?: string | undefined;
      session?: any;
    }) {
      // Initial sign-in
      if (user) {
        token = { ...token, ...user };
        token.accessToken = user.accessToken;
      }

      // When session is updated
      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        location: token.location as string,
        reputation: token.reputation as number,
        rewardsBalance: token.rewardsBalance as number,
        accessToken: token.accessToken,
      };
      session.refreshToken = token.refreshToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Security: Only allow redirects to same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  // Security events
  events: {
    async signIn({ user }: { user: User }) {
      console.log(`User signed in: ${user.name}`);
    },

    async signOut({ session, token }: { session: Session; token: JWT }) {
      console.log("User signed out");
    },
  },
  // Debug mode for development
  debug: process.env.NODE_ENV === "development",
};
