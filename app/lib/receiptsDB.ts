"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

export const getReceipts = unstable_cache(
  async () => {
    const session = await getServerSession(authOptions);
    const userId = parseInt(session?.user?.id as string);

    const receipts = await prisma.receipt.findMany({
      where: {
        project: {
          userId: userId,
        },
      },
      include: {
        items: true,
        project: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return receipts;
  },
  ["receipts"],
  { tags: ["receipts"], revalidate: 60 }
);

export const getReceiptById = unstable_cache(
  async (id: string) => {
    const session = await getServerSession(authOptions);
    const userId = parseInt(session?.user?.id as string);
    const receipt = await prisma.receipt.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        items: true,
        project: true,
      },
    });

    return receipt;
  },
  ["receipts"],
  { tags: ["receipts"], revalidate: 60 }
);
