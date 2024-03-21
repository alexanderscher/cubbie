"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

import { revalidateTag } from "next/cache";

export const revalidate = async (name: string) => {
  const session = await auth();
  const userId = session?.user?.id as string;

  revalidateTag(`projects_user_${userId}`);
};
