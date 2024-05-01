"use server";
import { revalidateUsersInProject } from "@/actions/revalidateUsers";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";
export const changeProjectOwner = async (
  projectId: number,
  newOwnerId: string
): Promise<any> => {
  try {
    // Retrieve the current owner of the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });
    if (!project) {
      return { error: "Project not found" };
    }

    // Retrieve the new owner
    const newOwner = await prisma.user.findUnique({
      where: { id: newOwnerId },
    });
    if (!newOwner) {
      return { error: "New owner not found" };
    }

    // Update the project's userId field to the new owner's ID
    await prisma.project.update({
      where: { id: projectId },
      data: { userId: newOwner.id },
    });

    // Move the current owner to the projectUsers array
    await prisma.projectUser.create({
      data: {
        user: { connect: { id: project.user.id } },
        project: { connect: { id: projectId } },
      },
    });

    // Delete the new owner from the projectUser array
    await prisma.projectUser.deleteMany({
      where: {
        projectId: projectId,
        userId: newOwnerId,
      },
    });
    revalidateTag(`project_${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to change project owner:", error);
    return { error: "An error occurred while changing the project owner" };
  }
};
