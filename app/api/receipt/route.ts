import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const currentDate = new Date();

  const receipts = await prisma.receipt.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: {
      items: true,
    },
  });

  const updatePromises = receipts.map((receipt) => {
    const isExpired = new Date(receipt.return_date) < currentDate;
    if (receipt.expired !== isExpired) {
      return prisma.receipt.update({
        where: { id: receipt.id },
        data: { expired: isExpired },
      });
    }
  });

  await Promise.all(updatePromises);

  return new NextResponse(
    JSON.stringify({
      receipts,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
