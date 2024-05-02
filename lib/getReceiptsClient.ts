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

  const getUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      alertSettings: {
        include: {
          timezone: true,
        },
      },
    },
  });

  const userTimezone = getUser?.alertSettings?.timezone?.value || "UTC"; // Providing a default value

  const currentDateInUserTimezone = moment().tz(userTimezone).startOf("day");
  console.log("currentDateInUserTimezone", currentDateInUserTimezone);
  const updatePromises = receipts.map((receipt) => {
    if (!userTimezone) {
      // Handle the case where userTimezone is undefined
      console.error("User timezone is undefined.");
      return null;
    }

    const receiptReturnDate = moment
      .tz(receipt.return_date, userTimezone) // Using user's timezone
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
        userId: userId,
        projectUserArchive: {
          none: {
            userId: userId,
          },
        },
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

  const getUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      alertSettings: {
        include: {
          timezone: true,
        },
      },
    },
  });

  // const userTimezone = getUser?.alertSettings?.timezone?.value || "UTC"; // Providing a default value

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

  // if (!receipt) {
  //   // Handle the case where receipt is not found
  //   console.error("Receipt not found.");
  //   return null;
  // }

  // const receiptReturnDate = moment
  //   .tz(receipt.return_date, userTimezone)
  //   .startOf("day");

  // const currentDateInUserTimezone = moment().tz(userTimezone).startOf("day");

  // const isExpired = receiptReturnDate.isBefore(
  //   currentDateInUserTimezone,
  //   "day"
  // );

  // if (isExpired) {
  //   await prisma.receipt.update({
  //     where: { id: receipt.id },
  //     data: { expired: true },
  //   });
  // }
  // if (!isExpired && receipt.expired) {
  //   return prisma.receipt.update({
  //     where: { id: receipt.id },
  //     data: { expired: false },
  //   });
  // }

  return receipt;
};
