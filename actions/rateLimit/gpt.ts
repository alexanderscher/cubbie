"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export async function incrementApiCall() {
  const session = (await auth()) as Session;

  const usage = await prisma.userPlanUsage.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!usage) {
    console.error("No usage data found for the user.");
    return;
  }

  const now = new Date(new Date().toISOString());
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // One week ago, in UTC

  if (usage.lastReset < oneWeekAgo) {
    await prisma.userPlanUsage.update({
      where: {
        userId: session.user.id,
      },
      data: {
        apiCalls: 1, // Reset and increment
        lastReset: now, // Update last reset time, in UTC
      },
    });
  } else {
    await prisma.userPlanUsage.update({
      where: {
        userId: session.user.id,
      },
      data: {
        apiCalls: {
          increment: 1,
        },
      },
    });
  }

  return usage.apiCalls;
}
