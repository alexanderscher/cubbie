import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        receipts: {
          include: {
            items: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify({ projects }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);

    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while processing your request.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
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
