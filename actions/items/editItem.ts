"use server";

import { revalidateUsersInProject } from "@/actions/revalidateUsers";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/actions/uploadthing/uploadPhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { ItemReceiptType } from "@/types/ItemsTypes";
import { Session } from "next-auth";

import { revalidateTag } from "next/cache";

export const editItem = async (
  id: string,
  values: any,
  receipt: ItemReceiptType
) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  if (!userId) {
    return { error: "Unauthorized" };
  }

  try {
    const {
      description,
      edit_image,
      photo_url,
      photo_key,
      price,
      barcode,
      character,
    } = values;

    const uploadedFileKeys = [];

    let receiptFileUrl = "";
    let receiptFileKey = "";
    if (edit_image) {
      const uploadResults = await handleUpload(edit_image);
      if (uploadResults.length > 0) {
        receiptFileUrl = uploadResults[0].url;
        receiptFileKey = uploadResults[0].key;
        uploadedFileKeys.push(receiptFileKey);
      }
      if (photo_key) {
        await deleteUploadThingImage(photo_key);
      }
    }

    if (photo_url === "" && photo_key !== "") {
      await deleteUploadThingImage(photo_key);
    }

    const updatedItem = await prisma.items.update({
      where: {
        id: parseInt(id),
      },
      data: {
        description,
        price: parseFloat(price),
        barcode,
        character,

        photo_url: receiptFileUrl === "" ? photo_url : receiptFileUrl,
        photo_key: receiptFileUrl === "" ? photo_key : receiptFileKey,
      },
    });
    revalidateTag(`projects_user_${userId}`);
    if (receipt?.project_id) {
      revalidateUsersInProject(receipt?.project_id);
    }
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
