"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import moment from "moment";
import { Session } from "next-auth";
import "moment-timezone";

export const getReceiptsClient = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const receipts = await prisma.receipt.findMany({
    where: {
      project: {
        OR: [
          { userId: userId },
          { projectUsers: { some: { userId: userId } } },
        ],
      },
    },

    include: {
      items: true,
      project: {
        include: {
          projectUserArchive: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const updatePromises = receipts.map((receipt) => {
    const receiptReturnDate = moment.utc(receipt.return_date).startOf("day");

    // Check if the receipt return date is strictly before the start of today in UTC
    const isExpired = receiptReturnDate.isBefore(moment.utc().startOf("day"));

    if (isExpired) {
      return prisma.receipt.update({
        where: { id: receipt.id },
        data: { expired: true },
      });
    }

    if (!isExpired && receipt.expired) {
      return prisma.receipt.update({
        where: { id: receipt.id },
        data: { expired: false },
      });
    }
  });

  await Promise.all(updatePromises.filter((promise) => promise !== null));
  const updatedReceipts = await prisma.receipt.findMany({
    where: {
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
    include: {
      items: true,
      project: true,
    },
    orderBy: {
      return_date: "asc",
    },
  });
  return updatedReceipts;
};

export const getReceiptByIdClient = async (id: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const receipt = await prisma.receipt.findUnique({
    where: {
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
      id: parseInt(id),
    },
    include: {
      items: true,
      project: {
        include: {
          projectUserArchive: true,
        },
      },
    },
  });

  if (!receipt) {
    console.error("Receipt not found.");
    return null;
  }

  const receiptReturnDate = moment.utc(receipt.return_date).startOf("day");

  // Check if the receipt return date is strictly before the start of today in UTC
  const isExpired = receiptReturnDate.isBefore(moment.utc().startOf("day"));

  if (isExpired && !receipt.expired) {
    return await prisma.receipt.update({
      where: { id: receipt.id },
      data: { expired: true },
      include: {
        items: true,
        project: {
          include: {
            projectUserArchive: true,
          },
        },
      },
    });
  } else if (!isExpired && receipt.expired) {
    return await prisma.receipt.update({
      where: { id: receipt.id },
      data: { expired: false },
      include: {
        items: true,
        project: {
          include: {
            projectUserArchive: true,
          },
        },
      },
    });
  }

  return receipt;
};
