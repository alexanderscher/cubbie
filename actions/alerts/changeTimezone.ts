"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

interface ChangeTimezone {
  abbrev: string;
  offset: number;
  altName: string;
  value: string;
  label: string;
}

export const changeTimezone = async ({
  selectedTimezone,
}: {
  selectedTimezone: ChangeTimezone;
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
            value: selectedTimezone.value,
            label: selectedTimezone.label,
          },
        },
      },
    });
    revalidateTag(`user_${userId}`);
  } catch (e) {
    return { error: "An error occured" };
  }
};
