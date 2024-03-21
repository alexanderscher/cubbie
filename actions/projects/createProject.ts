"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

import { revalidateTag } from "next/cache";

export const createProject = async (name: string) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  await prisma.project.create({
    data: {
      name,
      userId,
      created_at: new Date().toISOString(),
    },
  });
  revalidateTag(`projects_user_${userId}`);
};
