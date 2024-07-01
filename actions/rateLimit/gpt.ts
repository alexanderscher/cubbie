"use server";
import prisma from "@/prisma/client";

type ApiCallType = {
  status: string;
  message: string;
};

export const canMakeRequest = async (
  userId: string,
  projectId: number,
  planId: number,
  endpointUsed: string,
  projectUserId: string
): Promise<ApiCallType> => {
  try {
    let limit = 0;

    if (planId == 2) {
      limit = 50;
    } else if (planId == 3) {
      limit = 20;
    }
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
          endpointUsed: endpointUsed,
          timestamp: new Date(), // Current date and time
          projectOwner: projectUserId,
        },
      });
      console.log("First request logged.");
      return { status: "200", message: "Request logged successfully." };
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
      return {
        status: "429",
        message: `You have reached the limit of ${limit} API calls per week.`,
      };
    }

    // Log the successful request
    await prisma.apiRequestLog.create({
      data: {
        userId: userId,
        projectId: projectId,
        planId: planId,
        endpointUsed: endpointUsed,
        timestamp: new Date(), // Current date and time
        projectOwner: projectUserId,
      },
    });

    console.log("Request logged successfully.");
    return { status: "200", message: "Request logged successfully." };
  } catch (error) {
    console.error("Error in canMakeRequest:", error);
    return {
      status: "500",
      message: "There was an error with the API call. Please try again.",
    };
  }
};

export const getApiUsage = async (userId: string, planId: number) => {
  // Find the first request ever for the given user and project

  let limit = 0;

  if (planId == 2) {
    limit = 50;
  } else if (planId == 3) {
    limit = 20;
  }

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

  const resetDate = new Date(startOfCurrentPeriod);
  resetDate.setDate(resetDate.getDate() + 7);

  return {
    used: requestCount,
    limit: limit,
    resetDate: resetDate,
  };
};
