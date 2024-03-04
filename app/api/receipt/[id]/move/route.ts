import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const json = await request.json();
  console.log(params.id);

  const projectId = json.projectId;

  const receipt = await prisma.receipt.update({
    where: {
      id: parseInt(params.id),
    },
    data: {
      project_id: projectId,
    },
  });

  return new NextResponse(
    JSON.stringify({
      receipt,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
