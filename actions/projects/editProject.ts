"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";

export const editProject = async (projectId: number, name: string) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    await prisma.project.update({
      where: {
        userId,
        id: projectId,
      },
      data: { name },
    });

    revalidateTag(`projects_user_${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to edit project:", error);
    return { error: "Failed to edit project" };
  }
};
