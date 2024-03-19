import { deleteUploadThingImage } from "@/app/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/app/actions/uploadthing/uploadPhoto";
import prisma from "@/prisma/client";
import { ItemInput } from "@/types/form";
import { calculateReturnDate } from "@/utils/Date";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
      assetAmount,
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
          error: `Missing or invalid fields: ${missingFields.join(", ")}`,
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

          return {
            description: item.description,
            photo_url: itemPhotoUrl,
            photo_key: itemPhotoKey,
            price: parseFloat(item.price),
            barcode: item.barcode,
            character: item.character,
            product_id: item.product_id,
            created_at: new Date().toISOString(),
            projectId: parseInt(folder),
          };
        })
      );

      return itemsArray;
    };

    const itemsArray = await processItems(items);

    const return_date = calculateReturnDate(purchase_date, days_until_return);

    const dateObjectPurchase = new Date(purchase_date);
    const purchaseDate = dateObjectPurchase.toISOString();
    const dateObjectReturn = new Date(return_date);
    const returnDate = dateObjectReturn.toISOString();

    const receipt = await prisma.receipt.create({
      data: {
        type,
        store,
        card,
        asset_amount: parseInt(assetAmount),
        tracking_number: tracking_number,
        purchase_date: purchaseDate,
        days_until_return: days_until_return,
        return_date: returnDate,
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
