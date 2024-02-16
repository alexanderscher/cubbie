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
    },
  });

  console.log(receipt);

  return new NextResponse(
    JSON.stringify({
      receipt,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
