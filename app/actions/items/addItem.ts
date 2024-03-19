"use server";
import { deleteUploadThingImage } from "@/app/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/app/actions/uploadthing/uploadPhoto";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

interface Item {
  description: string;
  price: string;
  barcode: string;
  character: string;
  product_id: string;
  photo: string;
  receipt_id: number;
}

export const addItem = async (values: Item) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const keyList = [];
  const {
    description,
    price,
    barcode,
    character,
    product_id,
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
      product_id,
      photo_url: receiptFileUrl,
      photo_key: receiptFileKey,
      created_at: new Date(),
    },
  });
  revalidateTag(`projects_user_${userId}`);
};
