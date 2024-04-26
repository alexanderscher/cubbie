"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";

export const changeTimezone = async ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.alertSettings.update({
      where: {
        userId: userId,
      },
      data: {
        timezone: {
          update: {
            value,
            label,
          },
        },
      },
    });
    revalidateTag(`user_${userId}`);
  } catch (e) {
    return { error: "An error occured" };
  }
};
