import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  // Delete other records first...

  const items = await prisma.items.deleteMany({});
  const receipt = await prisma.receipt.deleteMany({});

  return new NextResponse(JSON.stringify({ message: "Success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
