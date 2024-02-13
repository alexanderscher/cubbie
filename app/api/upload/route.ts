import { ourFileRouter } from "@/app/api/uploadthing/core";
import { utapi } from "@/app/server/uploadthing";
import prisma from "@/prisma/client";
import { ItemInput } from "@/types/formTypes/form";
import { useUploadThing } from "@/utils/uploadthing";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
  //   onClientUploadComplete: (res) => {
  //     (async () => {})().catch(console.error);
  //   },
  // });
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
      receiptImageFile,
      items,
    } = json;

    await utapi.uploadFilesFromUrl(json.receiptImage);

    // if (
    //   receiptImageFile &&
    //   receiptImageFile instanceof File &&
    //   permittedFileInfo &&
    //   receiptImage
    // ) {
    //   startUpload([receiptImageFile]);
    // }

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

    const receipt = {};

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
