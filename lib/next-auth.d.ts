// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
    refreshToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    location: string;
    reputation: number;
    rewardsBalance: number;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    location: string;
    reputation: number;
    rewardsBalance: number;
    accessToken?: string;
    refreshToken?: string;
  }
}
