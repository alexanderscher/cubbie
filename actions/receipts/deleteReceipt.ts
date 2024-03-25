"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

import { revalidateTag } from "next/cache";

export const deleteReceipt = async (receiptId: number) => {
  const session = await auth();
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
  } catch (error) {
    return { error: "Error deleting receipt" };
  }
};
