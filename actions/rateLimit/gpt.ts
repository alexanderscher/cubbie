"use server";
import prisma from "@/prisma/client";

export const canMakeRequest = async (
  userId: string,
  projectId: number,
  planId: number
): Promise<{ status: string; message: string }> => {
  try {
    let limit = 0;

    if (planId == 2) {
      limit = 50;
    } else if (planId == 3) {
      limit = 20;
    }

    const firstRequest = await prisma.apiRequestLog.findFirst({
      where: {
        OR: [{ userId: userId }, { projectId: projectId }],
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    if (!firstRequest) {
      return { status: "200", message: "Request logged successfully." };
    }

    const firstRequestDate = new Date(firstRequest.timestamp);
    const currentDate = new Date();
    const msInDay = 1000 * 60 * 60 * 24;
    const daysSinceFirstRequest = Math.floor(
      (currentDate.getTime() - firstRequestDate.getTime()) / msInDay
    );

    const startOfCurrentPeriod = new Date(firstRequestDate);
    startOfCurrentPeriod.setUTCDate(
      firstRequestDate.getUTCDate() + Math.floor(daysSinceFirstRequest / 7) * 7
    );

    const requestCount = await prisma.apiRequestLog.count({
      where: {
        OR: [{ userId: userId }, { projectId: projectId }],
        timestamp: {
          gte: startOfCurrentPeriod,
        },
      },
    });

    if (requestCount >= limit) {
      return {
        status: "429",
        message: `You have reached the limit of ${limit} API calls per week.`,
      };
    }

    return { status: "200", message: "Request allowed." };
  } catch (error) {
    console.error("Error in canMakeRequest:", error);
    return {
      status: "500",
      message: "There was an error with the API call. Please try again.",
    };
  }
};

export const appendApiUsage = async (
  userId: string,
  projectId: string,
  planId: number,
  endpointUsed: string,
  projectUserId: string
) => {
  await prisma.apiRequestLog.create({
    data: {
      userId: userId,
      projectId: parseInt(projectId),
      planId: planId,
      endpointUsed: endpointUsed,
      timestamp: new Date(),
      projectOwner: projectUserId,
    },
  });
  console.log("First request logged.");
};

export const getApiUsage = async (userId: string, planId: number) => {
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
