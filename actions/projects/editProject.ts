"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

import { revalidateTag } from "next/cache";

export const editProject = async (projectId: number, name: string) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  await prisma.project.update({
    where: {
      userId,
      id: projectId,
    },
    data: { name },
  });
  revalidateTag(`projects_user_${userId}`);
};
