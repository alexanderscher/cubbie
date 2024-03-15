"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: number) {
  return [`projects_user_${userId}`];
}

export const getReceipts = async () => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const receipts = await prisma.receipt.findMany({
        where: {
          project: {
            userId: userId,
          },
        },
        include: {
          items: true,
          project: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      // const currentDate = new Date();

      // const updatePromises = receipts.map((receipt) => {
      //   const isExpired = new Date(receipt.return_date) < currentDate;
      //   if (receipt.expired !== isExpired) {
      //     return prisma.receipt.update({
      //       where: { id: receipt.id },
      //       data: { expired: isExpired },
      //     });
      //   }
      // });

      // const updated = await Promise.all(updatePromises);

      return receipts;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};

export const getReceiptById = async (id: string) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const dynamicKey = getDynamicCacheKey(userId);

  return unstable_cache(
    async () => {
      const receipt = await prisma.receipt.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          items: true,
          project: true,
        },
      });
      return receipt;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )();
};
