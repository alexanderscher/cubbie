"use server";
import { deleteUploadThingImage } from "@/app/actions/uploadthing/deletePhoto";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const deleteItem = async (id: number) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

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
};
