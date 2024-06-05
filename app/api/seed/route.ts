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
          price: 0,
        },
        {
          id: 2,
          name: "All Projects Plan",
          price: 0,
        },
        {
          id: 3,
          name: "Individual Projects Plan",
          price: 0,
        },
      ],
    });
  } catch (error) {
    console.error("Error creating plans:", error);
  }
}
