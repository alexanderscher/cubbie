// pages/api/createPlans.ts

import prisma from "@/prisma/client";

export async function POST(request: Request) {
  try {
    // Create plans
    const plans = await prisma.plan.createMany({
      data: [
        {
          id: 1,
          name: "Free Plan",
          description: "A free plan with limited features",
          price: 0,
          maxItems: 50,
          hasAI: false,
          hasAlerts: false,
        },
        {
          id: 2,
          name: "All Projects Plan",
          description: "A plan that covers all projects",
          price: 0,
          maxItems: 1000,
          hasAI: true,
          hasAlerts: true,
        },
        {
          id: 3,
          name: "Individual Projects Plan",
          description: "A plan for individual projects",
          price: 0,
          maxItems: 100,
          hasAI: true,
          hasAlerts: true,
        },
      ],
    });
  } catch (error) {
    console.error("Error creating plans:", error);
  }
}
