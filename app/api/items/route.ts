import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const items = await prisma.items.findMany({
    include: {
      receipt: true,
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
