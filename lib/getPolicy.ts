"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return [`returns_user_${userId}`];
}

export const getPolicy = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      try {
        const session = (await auth()) as Session;
        const userId = session?.user?.id as string;
        if (!userId) {
          return { error: "Unauthorized" };
        }

        const items = await prisma.returns.findMany({
          where: {
            userId,
          },
          orderBy: {
            created_at: "desc",
          },
        });
        return { items };
      } catch (error) {
        console.error(error);
        return { error: "An error occurred" };
      }
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};
