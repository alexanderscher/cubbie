"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { deleteReceipt } from "@/actions/receipts/deleteReceipt";

export const deleteSelectedReceipts = async (receiptIds: number[]) => {
  try {
    for (const receiptId of receiptIds) {
      await deleteReceipt(receiptId);
    }
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return { error: "Failed to delete receipt" };
  }
};

export const deleteAllReceipts = async () => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    const projects = await prisma.project.findMany({
      where: {
        OR: [{ userId }, { projectUsers: { some: { userId } } }],
      },
      select: {
        id: true,
      },
    });

    const projectIds = projects.map((project) => project.id);

    const receipts = await prisma.receipt.findMany({
      where: {
        project_id: {
          in: projectIds,
        },
      },
      select: {
        id: true,
        receipt_image_key: true,
        items: { select: { id: true, photo_key: true } },
        project_id: true,
      },
    });

    for (const receipt of receipts) {
      await deleteReceipt(receipt.id);
    }
  } catch (error) {
    return { error: "Error deleting all receipts" };
  }
};
