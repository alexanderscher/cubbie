"use server";
import { deleteUploadThingImage } from "@/app/actions/uploadthing/deletePhoto";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const deleteProject = async (projectId: number) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    console.log(`No project found with ID ${projectId} for user ID ${userId}.`);
    return;
  }

  const receipts = await prisma.receipt.findMany({
    where: { project_id: projectId },
    select: {
      id: true,
      receipt_image_key: true, // Adjust to match your actual schema
      items: {
        select: { id: true, photo_key: true }, // Adjust to match your actual schema
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

  revalidateTag("projects");
  console.log(`Project with ID ${projectId} successfully deleted.`);
};
