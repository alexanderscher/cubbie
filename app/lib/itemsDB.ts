"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: number) {
  return [`projects_user_${userId}`];
}

export const getItems = async () => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const items = await prisma.items.findMany({
        where: {
          receipt: {
            project: {
              userId: userId,
            },
          },
        },
        include: {
          receipt: {
            include: {
              project: true,
            },
          },
        },
      });

      return items;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};

export const getItemsById = async (id: string) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const item = await prisma.items.findUnique({
        where: {
          receipt: {
            project: {
              userId: userId,
            },
          },
          id: parseInt(id),
        },
        include: {
          receipt: {
            include: {
              project: true,
            },
          },
        },
      });

      return item;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};
