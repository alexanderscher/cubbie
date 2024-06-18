"use server";
import { revalidateUsersInProject } from "@/actions/revalidateUsers";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";
import { deleteReceipt } from "@/actions/receipts/deleteReceipt";

export const deleteSelectedReceipts = async (receiptIds: number[]) => {
  try {
    for (const receiptId of receiptIds) {
      await deleteReceipt(receiptId);
    }
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return { error: "Failed to delete receipt" };
  }
};

export const deleteAllReceipts = async () => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    // Find all projects for the user
    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    const projectIds = projects.map((project) => project.id);

    // Find all receipts for these projects
    const receipts = await prisma.receipt.findMany({
      where: {
        project_id: {
          in: projectIds,
        },
      },
      select: {
        id: true,
        receipt_image_key: true,
        items: { select: { id: true, photo_key: true } },
        project_id: true,
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

      await prisma.receipt.delete({
        where: {
          id: receipt.id,
        },
      });

      await prisma.alert.deleteMany({
        where: {
          receiptId: receipt.id,
        },
      });

      revalidateTag(`projects_user_${userId}`);

      if (receipt.project_id) {
        revalidateUsersInProject(receipt.project_id);
      }
    }
  } catch (error) {
    return { error: "Error deleting all receipts" };
  }
};
