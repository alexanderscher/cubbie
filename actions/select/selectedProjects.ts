"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { deleteProject } from "@/actions/projects/deleteProject";
import { archiveProject } from "@/actions/projects/archive";
import { deleteAllReceipts } from "@/actions/select/selectedReceipts";

export const checkProject = async (projectIds: number[]) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const usersProjects = await prisma.project.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
  });

  const usersProjectIds = usersProjects.map((project) => project.id);

  const notInUserProjects = projectIds.filter(
    (id) => !usersProjectIds.includes(id)
  );

  const notInUserProjectsNames = await prisma.project.findMany({
    where: { id: { in: notInUserProjects } },
    select: {
      name: true,
      id: true,
    },
  });

  if (notInUserProjects.length > 0) {
    return notInUserProjectsNames;
  } else {
    return [];
  }
};

export const deleteProjects = async (projectIds: number[]) => {
  try {
    for (const projectId of projectIds) {
      await deleteProject(projectId);
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    return { error: "Failed to delete project" };
  }
};

export const deleteAll = async () => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    // Call the deleteAllReceipts function with userId
    const receiptDeletionResult = await deleteAllReceipts();
    if (receiptDeletionResult?.error) {
      console.error(
        "Error deleting all receipts:",
        receiptDeletionResult.error
      );
      return { error: "Failed to delete receipts" };
    }

    const usersProjects = await prisma.project.findMany({
      where: {
        userId,
      },
    });

    const projectIds = usersProjects.map((project) => project.id);

    await deleteProjects(projectIds);
  } catch (error) {
    console.error("Error deleting projects:", error);
    return { error: "Failed to delete projects" };
  }
};

export const archiveProjects = async (projectIds: number[]) => {
  try {
    for (const projectId of projectIds) {
      await archiveProject(projectId);
    }
  } catch (error) {
    console.error("Error archiving projects:", error);
    return { error: "Failed to archive project" };
  }
};

export const archiveAll = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const usersProjects = await prisma.project.findMany({
    where: {
      OR: [{ userId }, { projectUsers: { some: { userId } } }],
    },
  });

  const projectIds = usersProjects.map((project) => project.id);

  await archiveProjects(projectIds);
};
