"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

export const createReturnPolicy = async (name: string, days: number) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const item = await prisma.returns.create({
      data: {
        store: name,
        days,
        created_at: new Date(),
        User: { connect: { id: userId } },
      },
    });
    revalidateTag(`returns_user_${userId}`);

    return { item };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const updatePolicy = async (id: number, name: string, days: number) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const item = await prisma.returns.update({
      where: {
        id,
      },
      data: {
        store: name,
        days,
        created_at: new Date(),
      },
    });
    revalidateTag(`returns_user_${userId}`);
    return { item };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};

export const deletePolicy = async (id: number) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const item = await prisma.returns.delete({
      where: {
        id,
      },
    });
    revalidateTag(`returns_user_${userId}`);
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
