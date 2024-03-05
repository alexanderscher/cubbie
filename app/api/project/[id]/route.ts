import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      receipts: {
        include: {
          items: true,
        },
      },
    },
  });

  return new NextResponse(
    JSON.stringify({
      project,
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
  const body = await request.json();
  const project = await prisma.project.update({
    where: {
      id: parseInt(params.id),
    },
    data: {
      name: body.name,
    },
  });
  return new NextResponse(
    JSON.stringify({
      project,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const projectId = parseInt(params.id);

  const receipts = await prisma.receipt.findMany({
    where: { project_id: projectId },
    select: {
      id: true,
      receipt_image_key: true,
      items: { select: { id: true, photo_key: true } },
    },
  });

  for (const receipt of receipts) {
    if (receipt && receipt.receipt_image_key) {
      await deleteUploadThingImage(receipt.receipt_image_key);
    }
    for (const item of receipt.items) {
      if (item && item.photo_key) {
        await deleteUploadThingImage(item.photo_key);
      }

      await prisma.items.delete({
        where: { id: item.id },
      });
    }
  }

  await prisma.receipt.deleteMany({
    where: { project_id: projectId },
  });

  const project = await prisma.project.delete({
    where: { id: projectId },
  });

  return new NextResponse(JSON.stringify({ project }), {
    headers: { "Content-Type": "application/json" },
  });
}
