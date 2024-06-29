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

// export const canMakeRequest = async (userId: string, projectId: number) => {
//   // Calculate the date 7 days ago
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//   // Count API requests in the last 7 days for the given user and project
//   const requestCount = await prisma.apiRequestLog.count({
//     where: {
//       userId: userId,
//       projectId: projectId,
//       timestamp: {
//         gte: sevenDaysAgo,
//       },
//     },
//   });

//   // Check if the request count is within the limit
//   if (requestCount >= 20) {
//     // Check when the last request was made to determine block period
//     const lastRequest = await prisma.apiRequestLog.findFirst({
//       where: {
//         OR: [{ userId: userId }, { projectId: projectId }],
//       },
//       orderBy: {
//         timestamp: "desc",
//       },
//     });

//     if (lastRequest) {
//       const lastRequestDate = lastRequest.timestamp;
//       lastRequestDate.setDate(lastRequestDate.getDate() + 7);
//       const currentDate = new Date();

//       if (currentDate <= lastRequestDate) {
//         // Still within the block period
//         return false;
//       }
//     }

//     // If more than 7 days have passed since the last request in the 7-day window, allow new requests
//     return true;
//   }

//   // Allow request if under limit
//   return true;
// };
