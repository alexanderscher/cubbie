"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export const getProjectsClient = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const projects = await prisma.project.findMany({
    where: {
      OR: [{ userId }, { projectUsers: { some: { userId } } }],
    },
    include: {
      user: true,
      receipts: {
        include: {
          items: true,
          project: {
            include: {
              projectUserArchive: true,
            },
          },
        },
      },
      subscription: true,
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

export const getProjectByIdClient = async (id: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const project = await prisma.project.findUnique({
    where: {
      OR: [{ userId }, { projectUsers: { some: { userId } } }],
      id: parseInt(id),
    },
    include: {
      user: true,
      subscription: true,

      receipts: {
        include: {
          items: true,
          project: {
            include: {
              projectUserArchive: true,
            },
          },
        },
      },
      projectUsers: {
        include: {
          user: true,
        },
      },
      projectUserArchive: true,
    },
  });

  return project;
};
