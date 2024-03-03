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
