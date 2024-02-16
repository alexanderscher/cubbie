import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const receipts = await prisma.items.findMany({
    orderBy: {
      created_at: "desc",
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
