"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return `alert_user_${userId}`;
}

export const getAlerts = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const alerts = await prisma.alert.findMany({
        where: {
          userId,
        },
        include: {
          receipt: true,
          readBy: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      return alerts;
    },
    ["alerts", dynamicKey],
    { tags: ["alerts", dynamicKey], revalidate: 60 }
  )(userId);
};
