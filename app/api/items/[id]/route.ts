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
