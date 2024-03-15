"use server";

import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const editProject = async (projectId: number, name: string) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  await prisma.project.update({
    where: {
      userId,
      id: projectId,
    },
    data: { name },
  });
  revalidateTag(`projects_user_${userId}`);
};
