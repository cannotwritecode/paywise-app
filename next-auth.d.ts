import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    role: string;
    location?: {
      lat: number;
      lng: number;
      address?: string;
    };
    reputation?: number;
    rewardsBalance?: number;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    location?: {
      lat: number;
      lng: number;
      address?: string;
    };
    reputation?: number;
    rewardsBalance?: number;
    accessToken?: string;
    refreshToken?: string;
  }
}
