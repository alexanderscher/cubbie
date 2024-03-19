"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const markAsReturned = async (id: number) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

  await prisma.items.update({
    where: {
      id: id,
    },
    data: {
      returned: true,
    },
  });

  revalidateTag(`projects_user_${userId}`);
};

export const unreturn = async (id: number) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);

  await prisma.items.update({
    where: {
      id: id,
    },
    data: {
      returned: false,
    },
  });

  revalidateTag(`projects_user_${userId}`);
};
