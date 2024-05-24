"use server";
import { revalidateUsersInProject } from "@/actions/revalidateUsers";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

export const leaveProject = async (projectId: number): Promise<any> => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return { error: "Project not found" };
    }

    await prisma.projectUser.delete({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
    });

    revalidateTag(`project_${projectId}`);
    revalidateTag(`projects_user_${userId}`);
  } catch (error) {
    console.error("Failed to add user to project:", error);
    return { error: "An error occurred while adding the user to the project" };
  }
};
