"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";

export const markAsRead = async (params: { alertID: string }) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const foundAlert = await prisma.alerts.findFirst({
    where: {
      AND: [{ id: params.alertID }, { userId: userId }],
    },
  });

  if (!foundAlert) {
    return { error: "Alert not found or doesn't belong to the user" };
  }
  try {
    await prisma.alerts.update({
      where: {
        id: params.alertID,
      },
      data: {
        read: true,
      },
    });
    revalidateTag(`alert_user_${userId}`);
  } catch (e) {
    return { error: "An error occured" };
  }
};

export const unmarkAsRead = async (params: { alertID: string }) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const foundAlert = await prisma.alerts.findFirst({
    where: {
      AND: [{ id: params.alertID }, { userId: userId }],
    },
  });

  if (!foundAlert) {
    return { error: "Alert not found or doesn't belong to the user" };
  }
  try {
    await prisma.alerts.update({
      where: {
        id: params.alertID,
      },
      data: {
        read: false,
      },
    });
    revalidateTag(`alert_user_${userId}`);
  } catch (e) {
    return { error: "An error occured" };
  }
};
