"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export const getPolicy = async () => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const items = await prisma.returns.findMany({
      where: {
        userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return { items };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
