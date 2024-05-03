"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export const getItemsClient = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const items = await prisma.items.findMany({
    where: {
      receipt: {
        project: {
          AND: [
            {
              projectUserArchive: {
                none: {
                  userId: userId,
                },
              },
            },
            {
              OR: [
                { userId: userId },
                { projectUsers: { some: { userId: userId } } },
              ],
            },
          ],
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
};

export const getItemsByIdClient = async (id: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const item = await prisma.items.findUnique({
    where: {
      receipt: {
        project: {
          AND: [
            {
              projectUserArchive: {
                none: {
                  userId: userId,
                },
              },
            },
            {
              OR: [
                { userId: userId },
                { projectUsers: { some: { userId: userId } } },
              ],
            },
          ],
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
};
