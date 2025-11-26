import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      location: string;
      reputation: number;
      rewardsBalance: number;
      accessToken: string;
    } & DefaultSession["user"];
    refreshToken?: string;
  }

  interface User {
    id: string;
    location: string;
    reputation: number;
    rewardsBalance: number;
    accessToken: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    location: string;
    reputation: number;
    rewardsBalance: number;
    accessToken: string;
    refreshToken?: string;
  }
}
