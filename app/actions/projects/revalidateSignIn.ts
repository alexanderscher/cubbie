"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const revalidate = async (name: string) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

  revalidateTag(`projects_user_${userId}`);
};
