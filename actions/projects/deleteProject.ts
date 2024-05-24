"use server";
import { revalidateUsersInProject } from "@/actions/revalidateUsers";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

import { revalidateTag } from "next/cache";

export const deleteProject = async (projectId: number) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  try {
    if (!userId) {
      return { error: "Unauthorized" };
    }
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      console.log(
        `No project found with ID ${projectId} for user ID ${userId}.`
      );
      return { error: "Project not found" };
    }

    const receipts = await prisma.receipt.findMany({
      where: { project_id: projectId },
      select: {
        id: true,
        receipt_image_key: true,
        items: {
          select: { id: true, photo_key: true },
        },
      },
    });

    for (const receipt of receipts) {
      if (receipt.receipt_image_key) {
        await deleteUploadThingImage(receipt.receipt_image_key);
      }
      for (const item of receipt.items) {
        if (item.photo_key) {
          await deleteUploadThingImage(item.photo_key);
        }
        await prisma.items.delete({
          where: { id: item.id },
        });
      }
    }

    await prisma.receipt.deleteMany({
      where: { project_id: projectId },
    });

    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidateTag(`project_${projectId}`);
    revalidateTag(`projects_user_${userId}`);

    console.log(`Project with ID ${projectId} successfully deleted.`);
  } catch (error) {
    console.error("Error deleting project:", error);
    return { error: "Failed to delete project" };
  }
};
