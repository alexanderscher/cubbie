"use server";
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
  }
  revalidateTag(`user_${session.user.id}`);
}

export const canMakeRequest = async (
  userId: string,
  projectId: number,
  planId: number,
  request: any,
  endpointUsed: string,
  projectUserId: string
) => {
  try {
    console.log("Function started: canMakeRequest");

    // Log input parameters
    console.log("Input Parameters:", {
      userId,
      projectId,
      planId,
      request,
      endpointUsed,
    });

    // Find the first request ever for the given user and project
    const firstRequest = await prisma.apiRequestLog.findFirst({
      where: {
        OR: [{ userId: userId }, { projectId: projectId }],
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    console.log("First request found:", firstRequest);

    if (!firstRequest) {
      // If there is no request logged, log the first request and allow the request
      await prisma.apiRequestLog.create({
        data: {
          userId: userId,
          projectId: projectId,
          planId: planId,
          request: JSON.stringify(request), // Serialize the request object
          endpointUsed: endpointUsed,
          timestamp: new Date(), // Current date and time
          projectOwner: projectUserId,
        },
      });
      console.log("First request logged.");
      return true;
    }

    const firstRequestDate = new Date(firstRequest.timestamp);

    // Get the current date and time
    const currentDate = new Date();

    // Define the number of milliseconds in a day
    const msInDay = 1000 * 60 * 60 * 24;

    // Calculate the number of days since the first request
    const daysSinceFirstRequest = Math.floor(
      (currentDate.getTime() - firstRequestDate.getTime()) / msInDay
    );

    // Create a new Date object starting from the first request date
    const startOfCurrentPeriod = new Date(firstRequestDate);

    // Calculate the start of the current 7-day period
    startOfCurrentPeriod.setUTCDate(
      firstRequestDate.getUTCDate() + Math.floor(daysSinceFirstRequest / 7) * 7
    );

    console.log("Start of current period:", startOfCurrentPeriod);

    // Count API requests in the current 7-day period for the given user and project
    const requestCount = await prisma.apiRequestLog.count({
      where: {
        OR: [{ userId: userId }, { projectId: projectId }],
        timestamp: {
          gte: startOfCurrentPeriod,
        },
      },
    });

    console.log("Request count in current period:", requestCount);

    // Check if the request count is within the limit
    if (requestCount >= 20) {
      console.log("Request limit reached.");
      return false;
    }

    // Log the successful request
    await prisma.apiRequestLog.create({
      data: {
        userId: userId,
        projectId: projectId,
        planId: planId,
        request: JSON.stringify(request), // Serialize the request object
        endpointUsed: endpointUsed,
        timestamp: new Date(), // Current date and time
        projectOwner: projectUserId,
      },
    });

    console.log("Request logged successfully.");
    return true;
  } catch (error) {
    console.error("Error in canMakeRequest:", error);
    return false;
  }
};

export const getApiUsage = async (userId: string, planId: number) => {
  // Find the first request ever for the given user and project
  const firstRequest = await prisma.apiRequestLog.findFirst({
    where: {
      OR: [{ userId: userId }, { projectOwner: userId }],
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  let startOfCurrentPeriod: Date;
  if (firstRequest) {
    const firstRequestDate = new Date(firstRequest.timestamp);
    const currentDate = new Date();
    const msInDay = 1000 * 60 * 60 * 24;
    const daysSinceFirstRequest = Math.floor(
      (currentDate.getTime() - firstRequestDate.getTime()) / msInDay
    );
    startOfCurrentPeriod = new Date(firstRequestDate);
    startOfCurrentPeriod.setUTCDate(
      firstRequestDate.getUTCDate() + Math.floor(daysSinceFirstRequest / 7) * 7
    );
  } else {
    // If no requests found, set the start of the current period to now
    startOfCurrentPeriod = new Date();
    startOfCurrentPeriod.setUTCDate(startOfCurrentPeriod.getUTCDate() - 7);
  }

  // Count API requests in the current 7-day period for the given user and project
  const requestCount = await prisma.apiRequestLog.count({
    where: {
      OR: [{ userId: userId }, { projectOwner: userId }],
      timestamp: {
        gte: startOfCurrentPeriod,
      },
    },
  });

  // Return the usage count for display
  return {
    used: requestCount,
    limit: 20,
  };
};
