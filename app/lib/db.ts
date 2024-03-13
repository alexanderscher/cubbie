"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

export const getProjects = unstable_cache(
  async () => {
    const session = await getServerSession(authOptions);
    const userId = parseInt(session?.user?.id as string);
    const projects = await prisma.project.findMany({
      where: { userId },

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

    return projects;
  },
  ["projects"],
  { tags: ["projects"] }
);
export const getReceipts = unstable_cache(
  async () => {
    const session = await getServerSession(authOptions);
    const userId = parseInt(session?.user?.id as string);

    const receipts = await prisma.receipt.findMany({
      include: {
        items: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return receipts;
  },
  ["receipts"],
  { tags: ["receipts"] }
);
