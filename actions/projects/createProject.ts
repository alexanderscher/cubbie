"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";

export const createProject = async (name: string, asset_amount: string) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    let new_asset_amount = "";

    if (asset_amount) {
      new_asset_amount = asset_amount;
    }

    await prisma.project.create({
      data: {
        name: name,
        asset_amount: parseFloat(new_asset_amount),
        userId,
        created_at: new Date().toISOString(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: "Failed to create project" };
  }
};
