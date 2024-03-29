"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/actions/uploadthing/uploadPhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import moment from "moment";
import { revalidateTag } from "next/cache";

interface ExtendedReceipt {
  id: number;
  type: string;
  store: string;
  card: string;
  receipt_image_url: string;
  receipt_image_key: string;
  tracking_number: string;
  purchase_date: Date;
  return_date: Date;
  asset_amount: number;
  edit_image: string;
}

export const editReceipt = async (params: {
  id: string;
  values: ExtendedReceipt;
}) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  if (!userId) {
    return { error: "Unauthorized" };
  }
  try {
    const {
      type,
      store,
      card,
      receipt_image_url,
      receipt_image_key,
      tracking_number,
      purchase_date,
      return_date,
      asset_amount,
      edit_image,
    } = params.values;

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
      if (receipt_image_key) {
        await deleteUploadThingImage(receipt_image_key);
      }
    }

    if (receipt_image_url === "" && receipt_image_key !== "") {
      await deleteUploadThingImage(receipt_image_key);
    }

    const expired = moment(return_date)
      .startOf("day")
      .isBefore(moment().startOf("day"));

    await prisma.receipt.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        type,
        store,
        card,
        receipt_image_url:
          receiptFileUrl === "" ? receipt_image_url : receiptFileUrl,
        receipt_image_key:
          receiptFileUrl === "" ? receipt_image_key : receiptFileKey,
        tracking_number,
        purchase_date: moment(purchase_date).toISOString(),
        return_date: moment(return_date).toISOString(),
        asset_amount: asset_amount,
        days_until_return: moment(return_date).diff(
          moment(purchase_date),
          "days"
        ),
        expired: expired,
      },
    });

    revalidateTag(`projects_user_${userId}`);
  } catch (error) {
    return { error: "An error occured" };
  }
};
