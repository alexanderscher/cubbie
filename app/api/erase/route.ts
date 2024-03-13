import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { deleteUploadThingImage } from "@/app/actions/uploadthing/deletePhoto";

export async function POST(request: Request) {
  const items = await prisma.items.findMany({});

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.photo_key) {
      await deleteUploadThingImage(item.photo_key);
    }
  }
  const receipts = await prisma.receipt.findMany({});

  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i];
    if (receipt.receipt_image_key) {
      await deleteUploadThingImage(receipt.receipt_image_key);
    }
  }

  const item = await prisma.items.deleteMany({});
  const receipt = await prisma.receipt.deleteMany({});

  return new NextResponse(JSON.stringify({ message: "Success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
