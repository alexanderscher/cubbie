"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";

import { revalidateTag } from "next/cache";

export const moveReceipt = async (params: {
  id: number;
  projectId: number;
}) => {
  const session = (await auth()) as Session;
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
    return { error: "Project not found or doesn't belong to the user" };
  }
  try {
    await prisma.receipt.update({
      where: {
        id: params.id,
      },
      data: {
        project_id: params.projectId,
      },
    });
    revalidateTag(`projects_user_${userId}`);
  } catch (e) {
    return { error: "An error occured" };
  }
};
