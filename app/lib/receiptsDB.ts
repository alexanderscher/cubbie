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
      // Retrieve all receipts for the user
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

      // Current date to compare with return_date
      const currentDate = new Date();

      // Check each receipt to see if its return_date is in the past
      // and update expired to true if needed
      const updatePromises = receipts.map((receipt) => {
        const isExpired = new Date(receipt.return_date) < currentDate;
        // If it's already expired, no need to update
        if (!receipt.expired && isExpired) {
          return prisma.receipt.update({
            where: { id: receipt.id },
            data: { expired: true },
          });
        }
      });

      // Wait for all update operations to complete
      await Promise.all(
        updatePromises.filter((promise) => promise !== undefined)
      );

      // Optionally, retrieve the receipts again to get the updated expired status
      // This step is necessary only if you need the most up-to-date `expired` statuses in the response
      const updatedReceipts = await prisma.receipt.findMany({
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

      return updatedReceipts;
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
