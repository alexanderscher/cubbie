"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export const checkDowngrade = async (
  currentPlanId: number,
  priceId: number
) => {
  console.log("currentPlanId", currentPlanId);
  if (currentPlanId === 2 && priceId === 3) {
    if ((await projectUsers()).length > 0) {
      return "You have more than 5 users in a project";
    } else if ((await receiptItems()) > 5) {
      return "You have more than 100 items in your receipts";
    }
    return null;
  }

  if (priceId === 1) {
    if ((await projectUsers()).length > 0) {
      return "You have more than 5 users in a project Freeeeee";
    } else if ((await receiptItems()) > 5) {
      return "You have more than 100 items in your receipts Freeeeee";
    }
    return null;
  }
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
    (project) => project.projectUsers.length > 1
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
