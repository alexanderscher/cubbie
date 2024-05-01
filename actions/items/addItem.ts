"use server";
import { revalidateUsersInProject } from "@/actions/revalidateUsers";
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

    let newPrice = 0.0;
    if (price !== "") {
      newPrice = parseFloat(price);
    } else {
      newPrice = 0.0;
    }

    const newItem = await prisma.items.create({
      data: {
        receipt_id: receipt_id,
        description,
        price: newPrice,
        barcode,
        character,
        photo_url: receiptFileUrl,
        photo_key: receiptFileKey,
        created_at: new Date(),
      },
    });
    revalidateTag(`projects_user_${userId}`);
    if (receipt_id) {
      const receipt = await prisma.receipt.findUnique({
        where: { id: receipt_id },
        select: {
          id: true,
          receipt_image_key: true,
          items: { select: { id: true, photo_key: true } },
          project_id: true,
        },
      });
      if (receipt?.project_id) {
        revalidateUsersInProject(receipt?.project_id);
      }
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to add item" };
  }
};
