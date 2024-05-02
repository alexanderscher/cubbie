"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return [`projects_user_${userId}`];
}

export const getItems = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const items = await prisma.items.findMany({
        where: {
          receipt: {
            project: {
              userId: userId,
              projectUserArchive: {
                none: {
                  userId: userId,
                },
              },
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
        orderBy: {
          created_at: "desc",
        },
      });

      return items;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};

export const getItemsById = async (id: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
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
