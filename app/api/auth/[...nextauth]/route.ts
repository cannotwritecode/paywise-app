import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          // Call backend login API
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, token, refreshToken } = response.data;

          if (user && token) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.avatar || null,
              location: user.location,
              reputation: user.reputation,
              rewardsBalance: user.rewardsBalance,
              accessToken: token,
              refreshToken: refreshToken,
            };
          }

          return null;
        } catch (error: any) {
          console.error("Login error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.error || "Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.location = (user as any).location;
        token.reputation = (user as any).reputation;
        token.rewardsBalance = (user as any).rewardsBalance;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).location = token.location;
        (session.user as any).reputation = token.reputation;
        (session.user as any).rewardsBalance = token.rewardsBalance;
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
