"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

import { revalidateTag } from "next/cache";

export const markAsReturned = async (id: number) => {
  const session = (await auth()) as Session;

  const userId = session?.user?.id as string;

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
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

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
