"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

import { unstable_cache } from "next/cache";

function getDynamicCacheKey(userId: string) {
  return [`projects_user_${userId}`];
}

export async function unifiedSearch(query: string) {
  const session = (await auth()) as Session;
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [projects, receipts, items] = await Promise.all([
    searchProjects(userId, query),
    searchReceipts(userId, query),
    searchItems(userId, query),
  ]);

  return { projects, receipts, items };
}

async function searchProjects(userId: string, query: string) {
  return prisma.project.findMany({
    where: {
      userId,
      name: {
        contains: query,
      },
    },
  });
}

async function searchReceipts(userId: string, query: string) {
  return prisma.receipt.findMany({
    where: {
      project: {
        userId: userId,
      },
      store: {
        contains: query,
      },
    },
  });
}

async function searchItems(userId: string, query: string) {
  return prisma.items.findMany({
    where: {
      receipt: {
        project: {
          userId: userId,
        },
      },
      description: {
        contains: query,
      },
    },
  });
}
