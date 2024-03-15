"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const createProject = async (name: string) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  await prisma.project.create({
    data: {
      name,
      userId,
      created_at: new Date().toISOString(),
    },
  });
  revalidateTag(`projects_user_${userId}`);
};
