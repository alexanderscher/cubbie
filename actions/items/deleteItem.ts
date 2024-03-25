"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";

export const deleteItem = async (id: number) => {
  try {
    const session = await auth();
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const findItem = await prisma.items.findUnique({
      where: {
        id,
      },
    });
    if (findItem) {
      const photo_key = findItem.photo_key;
      if (photo_key) {
        await deleteUploadThingImage(photo_key);
      }
    }

    const item = await prisma.items.delete({
      where: {
        id,
      },
    });
    revalidateTag(`projects_user_${userId}`);
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
