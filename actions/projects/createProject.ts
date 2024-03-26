"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

import { revalidateTag } from "next/cache";

export const createProject = async (name: string) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    await prisma.project.create({
      data: {
        name,
        userId,
        created_at: new Date().toISOString(),
      },
    });

    revalidateTag(`projects_user_${userId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: "Failed to create project" };
  }
};
