"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return `alert_user_${userId}`;
}

export const getAlertsNumber = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const unreadAlertsCount = await prisma.alert.count({
        where: {
          userId,
          readBy: {
            none: {
              userId,
            },
          },
        },
      });

      return unreadAlertsCount;
    },
    ["alerts", dynamicKey],
    { tags: ["alerts", dynamicKey], revalidate: 60 }
  )(userId);
};
