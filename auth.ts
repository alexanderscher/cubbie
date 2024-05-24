import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/prisma/client";
import authConfig from "@/auth.config";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";
import { getUserById } from "@/data/user";
import { Subscription } from "@prisma/client";
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    async signIn({ isNewUser, user }) {
      try {
        if (isNewUser) {
          console.log("New user signed in", user);
          if (user.id) {
            const defaultPlanId = 1;

            const newAlertSettings = await prisma.alertSettings.create({
              data: {
                userId: user.id,
                notifyToday: true,
                notifyInOneDay: true,
                notifyInOneWeek: true,
              },
            });

            const newSubscription = await prisma.subscription.create({
              data: {
                userId: user.id,
                planId: defaultPlanId,
              },
            });
            console.log("Assigned default plan to new user:", newSubscription);

            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: { planId: defaultPlanId },
              include: { plan: true },
            });
            console.log("User planId updated:", updatedUser);
          } else {
            console.error("User ID not found for the new user.");
          }
        }
      } catch (error) {
        console.error("Error during new user registration:", error);
        // Handle the error appropriately
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      if (user.id) {
        const existingUser = await getUserById(user.id);

        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;

        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );

          if (!twoFactorConfirmation) return false;

          // Delete two factor confirmation for next sign in
          await prisma.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // if (token.role && session.user) {
      //   session.user.role = token.role as UserRole;
      // }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user && token.email) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.stripeCustomerId = token.stripeCustomerId as string;
        session.user.subscriptions = token.subscriptions as Subscription[];
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.subscriptions = existingUser.subscriptions;
      token.stripeCustomerId = existingUser.stripeCustomerId;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
