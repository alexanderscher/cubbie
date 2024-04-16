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

    const archive = action === "true";

    const existingArchive = await prisma.projectUserArchive.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
    });

    if (existingArchive) {
      await prisma.projectUserArchive.delete({
        where: {
          id: existingArchive.id,
        },
      });
    } else {
      await prisma.projectUserArchive.create({
        data: {
          userId: userId,
          projectId: projectId,
        },
      });
    }

    revalidateTag(`projects_user_${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to modify archive status:", error);
    return { error: "Failed to edit project archive status" };
  }
};
