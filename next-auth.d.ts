import { Subscription, UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  stripeCustomerId: string;
  subscriptions: Subscription[];
  planId: number;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
