import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import { handleUpload } from "@/app/actions/uploadPhoto";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const items = await prisma.items.findMany({
    include: {
      receipt: {
        include: {
          project: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return new NextResponse(
    JSON.stringify({
      items,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST(request: Request) {
  const json = await request.json();
  const keyList = [];

  const {
    description,
    price,
    barcode,
    character,
    product_id,
    photo,
    receipt_id,
  } = json;

  try {
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

    return new NextResponse(JSON.stringify(newItem), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    if (keyList.length > 0) {
      keyList.forEach(async (key) => {
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
