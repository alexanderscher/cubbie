"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/actions/uploadthing/uploadPhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";

interface Item {
  description: string;
  price: string;
  barcode: string;
  character: string;
  photo: string;
  receipt_id: number;
}

export const addItem = async (values: Item) => {
  try {
    const session = (await auth()) as Session;

    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }
    const keyList = [];
    const {
      description,
      price,
      barcode,
      character,

      photo,
      receipt_id,
    } = values;

    let receiptFileUrl = "";
    let receiptFileKey = "";
    if (photo) {
      const uploadResults = await handleUpload(photo);
      if (uploadResults.length > 0) {
        receiptFileUrl = uploadResults[0].url;
        receiptFileKey = uploadResults[0].key;
        keyList.push(receiptFileKey);
      }
    }

    const newItem = await prisma.items.create({
      data: {
        receipt_id: receipt_id,
        description,
        price: parseFloat(price),
        barcode,
        character,

        photo_url: receiptFileUrl,
        photo_key: receiptFileKey,
        created_at: new Date(),
      },
    });
    revalidateTag(`projects_user_${userId}`);
  } catch (error) {
    console.error(error);
    return { error: "Failed to add item" };
  }
};
