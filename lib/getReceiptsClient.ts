"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import moment from "moment";
import { Session } from "next-auth";
import "moment-timezone";

export const getReceiptsClient = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const userTimezone = session.user.timezone || "America/Detroit";

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

  const currentDateInUserTimezone = moment().tz(userTimezone).startOf("day");
  console.log("currentDateInUserTimezone", currentDateInUserTimezone);
  const updatePromises = receipts.map((receipt) => {
    if (!userTimezone) {
      console.error("User timezone is undefined.");
      return null;
    }

    const receiptReturnDate = moment
      .tz(receipt.return_date, userTimezone)
      .startOf("day");

    const isExpired = receiptReturnDate.isBefore(
      currentDateInUserTimezone,
      "day"
    );

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
  const userTimezone = session.user.timezone || "America/Detroit";

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

  const receiptReturnDate = moment
    .tz(receipt.return_date, userTimezone)
    .startOf("day");
  const currentDateInUserTimezone = moment.tz(userTimezone).startOf("day");
  const isExpired = receiptReturnDate.isBefore(
    currentDateInUserTimezone,
    "day"
  );

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
