"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: number) {
  return [`projects_user_${userId}`];
}

export const getProjects = async () => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const dynamicKey = getDynamicCacheKey(userId);
  return unstable_cache(
    async (userId) => {
      const projects = await prisma.project.findMany({
        where: {
          userId,
        },
        include: {
          receipts: {
            include: {
              items: true,
            },
          },
        },
      });

      return projects;
    },
    dynamicKey,
    { tags: dynamicKey, revalidate: 60 }
  )(userId);
};

export const getProjectById = async (id: string) => {
  const session = await getServerSession(authOptions);
  const userId = parseInt(session?.user?.id as string);
  const dynamicKey = getDynamicCacheKey(userId);

  return unstable_cache(
    async (userId) => {
      const project = await prisma.project.findUnique({
        where: {
          userId,
          id: parseInt(id),
        },
        include: {
          receipts: {
            include: {
              items: true,
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
