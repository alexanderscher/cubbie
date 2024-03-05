import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import { handleUpload } from "@/app/actions/uploadPhoto";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const receipt = await prisma.receipt.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      items: true,
      project: true,
    },
  });

  return new NextResponse(
    JSON.stringify({
      receipt,
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
    type,
    store,
    card,
    edit_image,
    receipt_image_url,
    receipt_image_key,
    tracking_number,
    purchase_date,
    return_date,
    asset_amount,
  } = json;

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
      if (receipt_image_key) {
        await deleteUploadThingImage(receipt_image_key);
      }
    }

    if (receipt_image_url === "" && receipt_image_key !== "") {
      await deleteUploadThingImage(receipt_image_key);
    }

    const updatedReceipt = await prisma.receipt.update({
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
        purchase_date: new Date(purchase_date).toISOString(),
        return_date: new Date(return_date).toISOString(),
        asset_amount: parseFloat(asset_amount),
      },
    });

    return new NextResponse(JSON.stringify(updatedReceipt), {
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const receipt = await prisma.receipt.findUnique({
    where: { id: parseInt(params.id) },
    select: {
      id: true,
      receipt_image_key: true,
      items: { select: { id: true, photo_key: true } },
    },
  });

  if (receipt) {
    if (receipt.receipt_image_key) {
      await deleteUploadThingImage(receipt.receipt_image_key);
    }

    for (const item of receipt.items) {
      if (item) {
        if (item.photo_key) {
          await deleteUploadThingImage(item.photo_key);
        }
      }

      await prisma.items.delete({
        where: { id: item.id },
      });
    }
  }

  await prisma.receipt.delete({
    where: {
      id: parseInt(params.id),
    },
  });

  return new NextResponse(
    JSON.stringify({
      success: true,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
