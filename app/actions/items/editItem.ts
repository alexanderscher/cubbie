"use server";

import { deleteUploadThingImage } from "@/app/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/app/actions/uploadthing/uploadPhoto";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const editItem = async (id: string, values: any) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const {
    description,
    edit_image,
    photo_url,
    photo_key,
    price,
    barcode,
    character,
    product_id,
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
      product_id,
      photo_url: receiptFileUrl === "" ? photo_url : receiptFileUrl,
      photo_key: receiptFileUrl === "" ? photo_key : receiptFileKey,
    },
  });
  revalidateTag(`projects_user_${userId}`);
};
