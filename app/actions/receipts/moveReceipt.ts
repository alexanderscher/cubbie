"use server";

import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth/next";
import { revalidatePath, revalidateTag } from "next/cache";

export const moveReceipt = async (params: {
  id: number;
  projectId: number;
}) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

  const project = await prisma.project.findFirst({
    where: {
      AND: [{ id: params.projectId }, { userId: userId }],
    },
  });

  if (!project) {
    throw new Error("Project not found or doesn't belong to the user");
  }

  await prisma.receipt.update({
    where: {
      id: params.id,
    },
    data: {
      project_id: params.projectId,
    },
  });
  revalidateTag("projects");
  revalidateTag("receipts");
};
