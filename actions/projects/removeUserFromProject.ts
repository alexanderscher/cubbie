"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";

export const removeUserFromProject = async (
  removeUserId: string,
  projectId: number
): Promise<any> => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return { error: "Project not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: removeUserId },
    });
    if (!user) {
      return { error: "User not found" };
    }

    const projectUser = await prisma.projectUser.delete({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: user.id,
        },
      },
    });
    revalidateTag(`projects_user_${userId}`);
    revalidateUsersInProject(projectId);

    return projectUser;
  } catch (error) {
    console.error("Failed to add user to project:", error);
    return { error: "An error occurred while adding the user to the project" };
  }
};

function revalidateUsersInProject(projectId: number) {
  prisma.projectUser
    .findMany({
      where: {
        projectId: projectId,
      },
      select: {
        userId: true,
      },
    })
    .then((projectUsers) => {
      projectUsers.forEach((projectUser) => {
        try {
          revalidateTag(`projects_user_${projectUser.userId}`);
        } catch (err) {
          console.error(
            `Failed to revalidate user ${projectUser.userId}:`,
            err
          );
        }
      });
    })
    .catch((err) => {
      console.error("Error fetching project users:", err);
    });
}
