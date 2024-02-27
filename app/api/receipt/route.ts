import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const receipts = await prisma.receipt.findMany({
    orderBy: {
      return_date: "desc",
    },
    include: {
      items: true,
    },
  });

  return new NextResponse(
    JSON.stringify({
      receipts,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
