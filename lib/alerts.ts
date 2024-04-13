"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { unstable_cache } from "next/cache";

export const getAlerts = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  return unstable_cache(
    async (userId) => {
      const alerts = await prisma.alerts.findMany({
        where: {
          userId,
        },
        include: {
          receipt: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      return alerts;
    },
    ["alerts"],
    { tags: ["alerts"], revalidate: 60 }
  )(userId);
};
