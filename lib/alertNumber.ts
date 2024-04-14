"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
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
      const alerts = await prisma.alerts.findMany({
        where: {
          userId,
          read: false,
        },
      });

      return alerts.length;
    },
    ["alerts", dynamicKey],
    { tags: ["alerts", dynamicKey], revalidate: 60 }
  )(userId);
};
