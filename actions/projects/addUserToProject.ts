"use server";
import { sendProjectInvite } from "@/actions/email/sendProjectInvite";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

export const addUserToProject = async (
  email: string,
  projectId: number
): Promise<any> => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  if (session?.user?.planId === 1) {
    const usersInProject = await prisma.projectUser.findMany({
      where: {
        projectId: projectId,
      },
    });

    if (usersInProject.length >= 1) {
      return {
        error:
          "Upgrade Error: You have reached the limit of users you can add. Please upgrade your plan to add more users.",
      };
    }
  }
  if (session?.user?.planId === 3) {
    const usersInProject = await prisma.projectUser.findMany({
      where: {
        projectId: projectId,
      },
    });

    if (usersInProject.length >= 5) {
      return {
        error:
          "Upgrade Error: You have reached the limit of users you can add. Please upgrade your plan to add more users.",
      };
    }
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return { error: "Project not found" };
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return {
        error: `User not found with email ${email}.`,
      };
    }

    const projectUserExist = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: user.id,
        },
      },
    });

    if (projectUserExist) {
      return { error: "User already added to the project" };
    }

    if (user.id === userId) {
      return { error: "You are already the owner of this project" };
    }

    const projectUser = await prisma.projectUser.create({
      data: {
        userId: user.id,
        projectId: projectId,
      },
    });
    sendProjectInvite(email, project);
    revalidateTag(`project_${projectId}`);
    revalidateTag(`projects_user_${userId}`);

    return projectUser;
  } catch (error) {
    console.error("Failed to add user to project:", error);
    return { error: "An error occurred while adding the user to the project" };
  }
};
