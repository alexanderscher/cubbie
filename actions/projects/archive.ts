"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";

export const archiveProject = async (projectId: number, action: string) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    let archive = false;

    if (action === "true") {
      archive = true;
    } else {
      archive = false;
    }

    await prisma.project.update({
      where: {
        userId,
        id: projectId,
      },
      data: { archive: archive },
    });

    revalidateTag(`projects_user_${userId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to edit project" };
  }
};
