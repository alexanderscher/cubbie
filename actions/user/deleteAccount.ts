"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";

export const deleteAccount = async () => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const projects = await prisma.project.findMany({
      where: { userId: userId },
      include: {
        receipts: {
          include: {
            items: true,
          },
        },
      },
    });

    try {
      await Promise.all(
        projects.map(async (project) => {
          await Promise.all(
            project.receipts.map(async (receipt) => {
              if (receipt.receipt_image_key) {
                await deleteUploadThingImage(receipt.receipt_image_key);
              }
              await Promise.all(
                receipt.items.map(async (item) => {
                  if (item.photo_key) {
                    await deleteUploadThingImage(item.photo_key);
                  }
                })
              );
            })
          );
        })
      );

      //   await prisma.user.delete({
      //     where: { id: userId },
      //   });
      revalidateTag(`projects_user_${userId}`);
    } catch (error) {
      console.error(error);
      return { error: "An error occurred" };
    }
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
