"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import moment from "moment";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return [`projects_user_${userId}`];
}

export const getReceipts = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
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

      const currentDate = moment.utc().startOf("day");

      // Check each receipt to see if its return_date is strictly before the current day (in UTC)
      // and update expired to true if needed
      const updatePromises = receipts.map((receipt) => {
        // Convert return_date to UTC and set it to the start of that day, ensuring we compare full days
        const receiptReturnDate = moment
          .utc(receipt.return_date)
          .startOf("day");

        // Check if the return date is strictly before the current day
        // This comparison now ensures that as long as we're on 3/21 (or the return date), it's not expired, regardless of the current time of day
        const isExpired = receiptReturnDate.isBefore(currentDate);

        // Update only if it's not already marked as expired and the return date is strictly before today
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
  const session = await auth();
  const userId = session?.user?.id as string;
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
