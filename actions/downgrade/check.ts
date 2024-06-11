"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export const checkDowngrade = async (
  currentPlanId: number,
  priceId: number
) => {
  const users = await projectUsers();
  const items = await receiptItems();

  const message = {
    users: [] as any[],
    items: 0,
  };

  if (currentPlanId === 2 && priceId === 3) {
    if (users.length > 0) {
      message.users = users;
    }
    if (items > 5) {
      message.items = items;
    }
    return message;
  }

  if (priceId === 1) {
    if (users.length > 0) {
      message.users = users;
    } else if (items > 5) {
      message.items = items;
    }
    return message;
  }

  return message;
};

const projectUsers = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const projects = await prisma.project.findMany({
    where: {
      userId: userId,
    },
    include: {
      projectUsers: true,
    },
  });

  const projectsWithUsers = projects.filter(
    (project) => project.projectUsers.length > 0
  );

  return projectsWithUsers;
};

const receiptItems = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const receipts = await prisma.receipt.findMany({
    where: {
      project: {
        userId: userId,
      },
    },
    include: {
      items: true,
    },
  });

  const numberOfItems = receipts.reduce(
    (sum, receipt) => sum + receipt.items.length,
    0
  );
  return numberOfItems;
};
