"use server";
import { revalidate } from "@/app/api/cron/route";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

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

  const apiCalls = usage.apiCalls;

  const now = new Date(new Date().toISOString());
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

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
    if (session.user.planId === 1 || session.user.planId === null)
      return {
        auth: false,
        message: "Please upgrade to analyze receipts with AI",
      };
    if (session.user.planId === 3 && apiCalls && apiCalls >= 20) {
      return {
        auth: false,
        message: "You have reached the limit of 20 API calls per week.",
      };
    }
    if (session.user.planId === 2 && apiCalls && apiCalls >= 50) {
      return {
        auth: false,
        message: "You have reached the limit of 50 API calls per week.",
      };
    } else {
      const increment = await prisma.userPlanUsage.update({
        where: {
          userId: session.user.id,
        },
        data: {
          apiCalls: {
            increment: 1,
          },
        },
      });
      return { auth: true };
    }

    revalidateTag(`user_${session.user.id}`);
  }
}
