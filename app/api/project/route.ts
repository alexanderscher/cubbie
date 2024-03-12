import prisma from "@/prisma/client";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  console.log("session", session);
  try {
    if (session?.user?.id) {
      const projects = await prisma.project.findMany({
        where: { userId: parseInt(session.user.id) },

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
    } else {
      console.error("No session found");
      // return (
      //   new NextResponse(),
      //   {
      //     status: 401,
      //     headers: { "Content-Type": "application/json" },
      //   }
      // );
    }
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
  const { name, userId } = json;

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
      userId,
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
