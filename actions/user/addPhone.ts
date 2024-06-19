"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

export const addPhone = async (phone: string) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        phone: phone,
      },
    });

    revalidateTag(`user_${userId}`);
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
