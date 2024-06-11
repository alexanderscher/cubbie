"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { Items, Project } from "@prisma/client";

export const checkDowngrade = async (
  currentPlanId: number,
  priceId: number
) => {
  const message = {
    users: [] as Project[],
    items: [] as Project[],
  };

  if (currentPlanId === 2 && priceId === 3) {
    const users = await projectUsers(2);
    const items = await receiptItems(50);
    if (users.length > 0) {
      message.users = users;
    }
    if (items.length > 0) {
      message.items = items;
    }
    return message;
  }

  if (priceId === 1) {
    const users = await projectUsers(5);
    const items = await receiptItems(20);
    if (users.length > 0) {
      message.users = users;
    }
    if (items.length > 0) {
      message.items = items;
    }
    return message;
  }

  return message;
};

const projectUsers = async (limit: number) => {
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
    (project) => project.projectUsers.length > limit
  );

  return projectsWithUsers;
};

const receiptItems = async (limit: number) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const projects = await prisma.project.findMany({
    where: {
      userId: userId,
    },
    include: {
      receipts: {
        include: {
          items: true,
        },
      },
    },
  });

  interface Receipt {
    items: Items[];
  }

  const sumItems = (sum: number, receipt: Receipt): number =>
    sum + receipt.items.length;

  const filteredProjects = projects.filter((project) => {
    const numberOfItems = project.receipts.reduce(sumItems, 0);
    return numberOfItems > limit;
  });

  return filteredProjects;
};
