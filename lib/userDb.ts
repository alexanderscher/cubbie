"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return [`user_${userId}`];
}

export const getUserByEmail = async (email: string) => {
  if (!email) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      alertSettings: true,
    },
  });

  return user;
};

export const getUserInfo = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          alertSettings: true,
        },
      });

      return user;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};

export const getUserSubscriptionInfo = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          subscriptions: {
            include: {
              project: true,
            },
          },
          plan: true,
          projects: {
            include: {
              receipts: {
                select: {
                  items: true,
                },
              },
            },
          },
        },
      });

      return user;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};
