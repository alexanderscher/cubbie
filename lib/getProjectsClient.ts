"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";

export const getProjectsClient = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const projects = await prisma.project.findMany({
    where: {
      OR: [{ userId }, { projectUsers: { some: { userId } } }],
    },
    include: {
      receipts: {
        include: {
          items: true,
        },
      },
      user: true,
      projectUsers: {
        include: {
          user: true,
        },
      },
      projectUserArchive: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return projects;
};
