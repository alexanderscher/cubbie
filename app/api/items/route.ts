import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const items = await prisma.items.findMany({
    include: {
      receipt: true,
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
