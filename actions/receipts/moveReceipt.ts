"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

import { revalidateTag } from "next/cache";

export const moveReceipt = async (params: {
  id: number;
  projectId: number;
}) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  if (!userId) {
    return { error: "Unauthorized" };
  }

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
  revalidateTag(`projects_user_${userId}`);
};
