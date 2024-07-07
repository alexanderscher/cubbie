"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

export const toggleFactor = async ({ isToggled }: { isToggled: boolean }) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: isToggled,
      },
    });
    revalidateTag(`user_${userId}`);
  } catch (e) {
    return { error: "An error occured" };
  }
};
