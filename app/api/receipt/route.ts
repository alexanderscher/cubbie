import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const currentDate = new Date();

    const receipts = await prisma.receipt.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        items: true,
        project: true,
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
  } catch (error) {
    console.error("Error fetching or updating receipts:", error);

    // Optionally, you can customize the error response based on the type of error
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
      {
        status: 500, // Internal Server Error
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
