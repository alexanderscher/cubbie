import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: {
      receipts: {
        include: {
          items: true, // Include the items for each receipt
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return new NextResponse(JSON.stringify(projects), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const json = await request.json();

  const { name } = json;
  console.log(name);

  if (!name) {
    return new NextResponse(
      JSON.stringify({
        error: `Missing or invalid fields: name`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const project = await prisma.project.create({
    data: {
      name,
      created_at: new Date().toISOString(),
    },
  });

  return new NextResponse(
    JSON.stringify({
      project,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
