import { handleUpload } from "@/app/actions/uploadPhoto";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { utapi } from "@/app/server/uploadthing";
import prisma from "@/prisma/client";
import { ItemInput } from "@/types/formTypes/form";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
      finalReturnDate,
      receiptImage,
      items,
    } = json;

    let receiptFileUrl = "";
    let receiptFileKey = "";

    if (receiptImage) {
      handleUpload(receiptImage).then((uploadResults) => {
        if (uploadResults.length > 0) {
          const { url, key } = uploadResults[0];
          receiptFileUrl = url;
          receiptFileKey = key;
          console.log(receiptFileUrl, receiptFileKey);
        }
      });
    }

    const itemsArray = items.map((item: ItemInput) => {
      let itemPhotoUrl = "";
      let itemPhotoKey = "";
      if (item.photo) {
        handleUpload(item.photo).then((uploadResults) => {
          if (uploadResults.length > 0) {
            const { url, key } = uploadResults[0];
            itemPhotoUrl = url;
            itemPhotoKey = key;
          }
        });
      }
      return {
        description: item.description,
        photo_url: itemPhotoUrl,
        photo_key: itemPhotoKey,
        price: item.price,
        barcode: item.barcode,
        asset: item.asset,
        character: item.character,
        product_id: item.product_id,
      };
    });

    const receipt = await prisma.receipt.create({
      data: {
        type,
        store,
        card,
        amount,
        tracking_number: trackingNumber,
        purchase_date: boughtDate,
        days_until_return: daysUntilReturn,
        return_date: finalReturnDate,
        receipt_image_url: receiptFileUrl,
        receipt_image_key: receiptFileKey,
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
    console.error(err);
    return new NextResponse(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// const requiredFields = ["type", "store", "amount", "items"];

// const missingFields: string[] = [];

// for (const field of requiredFields) {
//   if (!json[field]) {
//     missingFields.push(field);
//   }
// }

// if (missingFields.length > 0) {
//   return new NextResponse(
//     JSON.stringify({
//       error: `Missing or invalid fields: ${missingFields.join(", ")}`,
//     }),
//     {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     }
//   );
// }

// const itemsArray = items.map((item: ItemInput) => {
//   return {
//     description: item.description,
//     photo: item.photo,
//     photoFile: item.photoFile,
//     price: item.price,
//     barcode: item.barcode,
//     asset: item.asset,
//     character: item.character,
//     product_id: item.product_id,
//   };
// });

// const receipt = await prisma.receipt.create({
//   data: {
//     type,
//     store,
//     card,
//     amount,
//     tracking_number: trackingNumber,
//     purchase_date: boughtDate,
//     days_until_return: daysUntilReturn,
//     return_date: finalReturnDate,
//     receipt_image: receiptImage,
//     items: {
//       create: itemsArray,
//     },
//   },
// });

// if (
//   receiptImageFile &&
//   receiptImageFile instanceof File &&
//   permittedFileInfo &&
//   receiptImage
// ) {
//   startUpload([receiptImageFile]);
// }
