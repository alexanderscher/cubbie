import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/prisma/client";
import authConfig from "@/auth.config";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";
import { getUserById } from "@/data/user";
import { Subscription } from "@prisma/client";
import { retrieveCustomerAndSubscriptionsByEmail } from "@/actions/stripe/getStripeUser";
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
            const newAlertSettings = await prisma.alertSettings.create({
              data: {
                userId: user.id,
                notifyToday: true,
                notifyInOneDay: true,
                notifyInOneWeek: true,
              },
            });

            console.log("Alert settings created", newAlertSettings);

            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: { planId: 1 },
              include: { plan: true },
            });

            console.log("Updated user with planId", updatedUser);

            const userPlanUsage = await prisma.userPlanUsage.create({
              data: {
                userId: user.id,
                planId: 1,
                apiCalls: 0, // Assuming starting from zero
                lastReset: new Date(), // Assuming it resets now
              },
            });
            console.log("User plan usage created", userPlanUsage);

            if (user.email) {
              const existingStripe =
                await retrieveCustomerAndSubscriptionsByEmail(user.email);
              if (existingStripe) {
                const updateData: any = {};

                if (existingStripe.customer) {
                  updateData.stripeCustomerId = existingStripe.customer;
                }

                if (
                  existingStripe.subscriptions.includes("Limited Project Plan")
                ) {
                  updateData.hasUsedTrialLimited = true;
                }

                if (
                  existingStripe.subscriptions.includes("Advanced Project Plan")
                ) {
                  updateData.hasUsedTrialAdvanced = true;
                }

                if (Object.keys(updateData).length > 0) {
                  await prisma.user.update({
                    where: { id: user.id },
                    data: updateData,
                  });
                }
              }
            }
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

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user && token.email) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.stripeCustomerId = token.stripeCustomerId as string;
        session.user.subscription = token.subscription as Subscription;
        session.user.planId = token.planId as number;
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
      token.subscription = existingUser.subscription;
      token.stripeCustomerId = existingUser.stripeCustomerId;
      token.planId = existingUser.planId;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
