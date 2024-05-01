"use server";
import { revalidateUsersInProject } from "@/actions/revalidateUsers";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";

import { revalidateTag } from "next/cache";

export const deleteReceipt = async (receiptId: number) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  if (!userId) {
    return { error: "Unauthorized" };
  }
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: receiptId },
      select: {
        id: true,
        receipt_image_key: true,
        items: { select: { id: true, photo_key: true } },
        project_id: true,
      },
    });

    if (receipt) {
      if (receipt.receipt_image_key) {
        await deleteUploadThingImage(receipt.receipt_image_key);
      }

      for (const item of receipt.items) {
        if (item) {
          if (item.photo_key) {
            await deleteUploadThingImage(item.photo_key);
          }
        }

        await prisma.items.delete({
          where: { id: item.id },
        });
      }
    }

    await prisma.receipt.delete({
      where: {
        id: receiptId,
      },
    });

    revalidateTag(`projects_user_${userId}`);

    if (receipt?.project_id) {
      revalidateUsersInProject(receipt?.project_id);
    }
  } catch (error) {
    return { error: "Error deleting receipt" };
  }
};
