"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import moment from "moment";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return [`projects_user_${userId}`];
}

export const getReceipts = async () => {
  const session = (await auth()) as Session;
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

      const updatePromises = receipts.map((receipt) => {
        const receiptReturnDate = moment
          .utc(receipt.return_date)
          .startOf("day");

        const isExpired = receiptReturnDate.isBefore(currentDate);

        if (!receipt.expired && isExpired) {
          return prisma.receipt.update({
            where: { id: receipt.id },
            data: { expired: true },
          });
        }
      });
      await Promise.all(
        updatePromises.filter((promise) => promise !== undefined)
      );

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
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const dynamicKey = getDynamicCacheKey(userId);

  return unstable_cache(
    async () => {
      const receipt = await prisma.receipt.findUnique({
        where: {
          project: {
            userId: userId,
          },
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
