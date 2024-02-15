import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import { handleUpload } from "@/app/actions/uploadPhoto";
import prisma from "@/prisma/client";
import { ItemInput } from "@/types/formTypes/form";
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
      amount,
      trackingNumber,
      boughtDate,
      daysUntilReturn,
      receiptImage,
      items,
      memo,
      assetAmount,
    } = json;

    const requiredFields = ["type", "store", "amount", "items"];

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
          const price = parseFloat(item.price);
          console.log(item.price, price);

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
            asset: assetAmount > parseFloat(item.price) ? true : false,
            character: item.character,
            product_id: item.product_id,
          };
        })
      );

      return itemsArray;
    };

    const itemsArray = await processItems(items);

    const finalReturnDate = calculateReturnDate(boughtDate, daysUntilReturn);

    const dateObjectPurchase = new Date(boughtDate);
    const purchase_date = dateObjectPurchase.toISOString();
    const dateObjectReturn = new Date(finalReturnDate);
    const return_date = dateObjectReturn.toISOString();

    console.log("purchase_date:", purchase_date);
    console.log("return_date:", return_date);

    const receipt = await prisma.receipt.create({
      data: {
        type,
        store,
        card,
        amount: parseFloat(amount),
        tracking_number: trackingNumber,
        purchase_date: purchase_date,
        days_until_return: daysUntilReturn,
        return_date: return_date,
        receipt_image_url: receiptFileUrl,
        receipt_image_key: receiptFileKey,
        archive: false,
        memo,
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
