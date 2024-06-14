"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { deleteProject } from "@/actions/projects/deleteProject";

import { revalidateTag } from "next/cache";

export const deleteProjects = async (projectIds: number[]) => {
  try {
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
      return {
        notInUserProjectsNames,
      };
    } else {
      for (const projectId of projectIds) {
        await deleteProject(projectId);
      }
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    return { error: "Failed to delete project" };
  }
};
