import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/actions/uploadthing/uploadPhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { ItemInput } from "@/types/form";

import { calculateReturnDate } from "@/utils/Date";
import moment from "moment";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const uploadedFileKeys = [];

  try {
    const json = await request.json();

    const {
      type,
      store,
      card,
      tracking_number,
      purchase_date,
      days_until_return,
      receiptImage,
      items,
      memo,
      folder,
    } = json;

    const requiredFields = ["type", "store", "items"];

    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (!json[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return new NextResponse(
        JSON.stringify({
          error: `Missing the following fields: ${missingFields.join(", ")}`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (items.length === 0) {
      return new NextResponse(
        JSON.stringify({
          error: "At least one item is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let receiptFileUrl = "";
    let receiptFileKey = "";

    if (receiptImage) {
      const uploadResults = await handleUpload(receiptImage);
      if (uploadResults.length > 0) {
        receiptFileUrl = uploadResults[0].url;
        receiptFileKey = uploadResults[0].key;
        uploadedFileKeys.push(receiptFileKey);
      }
    }

    const processItems = async (items: ItemInput[]) => {
      const itemsArray = await Promise.all(
        items.map(async (item) => {
          let itemPhotoUrl = "";
          let itemPhotoKey = "";

          if (item.photo) {
            const uploadResults = await handleUpload(item.photo);
            if (uploadResults.length > 0) {
              const { url, key } = uploadResults[0];
              itemPhotoUrl = url;
              itemPhotoKey = key;
              uploadedFileKeys.push(itemPhotoKey);
            }
          }

          let newPrice = 0.0;
          if (item.price !== "") {
            newPrice = parseFloat(item.price);
          } else {
            newPrice = 0.0;
          }

          return {
            description: item.description,
            photo_url: itemPhotoUrl,
            photo_key: itemPhotoKey,
            price: newPrice,
            barcode: item.barcode,
            character: item.character,

            created_at: new Date().toISOString(),
          };
        })
      );

      return itemsArray;
    };

    const itemsArray = await processItems(items);

    const return_date = calculateReturnDate(purchase_date, days_until_return);

    const receipt = await prisma.receipt.create({
      data: {
        type,
        store,
        card,
        tracking_number: tracking_number,
        purchase_date: moment(purchase_date).toISOString(),
        days_until_return: days_until_return,
        return_date: moment(return_date).toISOString(),
        receipt_image_url: receiptFileUrl,
        receipt_image_key: receiptFileKey,
        memo,
        project_id: parseInt(folder),
        created_at: new Date().toISOString(),
        items: {
          create: itemsArray,
        },
      },
    });

    revalidateTag(`projects_user_${userId}`);
    revalidateTag(`user_${userId}`);

    return new NextResponse(JSON.stringify(receipt), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (uploadedFileKeys.length > 0) {
      uploadedFileKeys.forEach(async (key) => {
        await deleteUploadThingImage(key);
      });
    }
    return new NextResponse(
      JSON.stringify({
        error:
          "We're having trouble processing your request right now. Please check your internet connection and try again. If the problem persists, our support team is here to help.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
