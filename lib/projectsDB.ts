"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";

import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return [`projects_user_${userId}`];
}

export const getProjects = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { userId }, // Projects where the user is the owner
            { projectUsers: { some: { userId } } }, // Projects where the user is a collaborator
          ],
        },
        include: {
          receipts: {
            include: {
              items: true,
            },
          },
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
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};

export const getProjectById = async (id: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const dynamicKey = getDynamicCacheKey(userId);

  return unstable_cache(
    async (userId) => {
      const project = await prisma.project.findUnique({
        where: {
          OR: [{ userId }, { projectUsers: { some: { userId } } }],
          id: parseInt(id),
        },
        include: {
          user: true,
          receipts: {
            include: {
              items: true,
            },
          },
          projectUsers: {
            select: {
              user: true,
            },
          },
        },
      });

      return project;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};
