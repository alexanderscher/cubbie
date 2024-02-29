import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();

    const returnItem = await prisma.items.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        returned: json.returned,
      },
    });
    return new NextResponse(
      JSON.stringify({
        returnItem,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        error:
          "We're having trouble processing your request right now. Please check your internet connection and try again. If the problem persists, our support team is here to help.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
