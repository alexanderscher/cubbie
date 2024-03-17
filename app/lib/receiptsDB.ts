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

      // Adjust current date to start of the day for comparison
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Sets the current date to midnight, ignoring the time part

      // Check each receipt to see if its return_date is in the past (before today)
      // and update expired to true if needed
      const updatePromises = receipts.map((receipt) => {
        const receiptReturnDate = new Date(receipt.return_date);
        receiptReturnDate.setHours(0, 0, 0, 0); // Optional: Adjust if you also want to ignore time part of return_date
        const isExpired = receiptReturnDate < currentDate;
        // Update only if it's not already marked as expired and the return date is before today
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
