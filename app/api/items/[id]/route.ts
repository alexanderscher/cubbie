import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import { handleUpload } from "@/app/actions/uploadPhoto";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const item = await prisma.items.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      receipt: true,
    },
  });

  return new NextResponse(
    JSON.stringify({
      item,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const json = await request.json();

  const {
    description,
    edit_image,
    photo_url,
    photo_key,
    price,
    barcode,
    character,
    product_id,
  } = json;
  console.log("json", json);

  const uploadedFileKeys = [];

  try {
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
        id: parseInt(params.id),
      },
      data: {
        description,
        price,
        barcode,
        character,
        product_id,
        photo_url: receiptFileUrl === "" ? photo_url : receiptFileUrl,
        photo_key: receiptFileUrl === "" ? photo_key : receiptFileKey,
      },
    });

    return new NextResponse(JSON.stringify(updatedItem), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
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
