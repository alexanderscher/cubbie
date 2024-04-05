"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/AppTypes";
import { revalidateTag } from "next/cache";

export const editProject = async (
  projectId: number,
  name: string,
  asset_amount: string
) => {
  try {
    const session = (await auth()) as Session;
    const userId = session?.user?.id as string;
    if (!userId) {
      return { error: "Unauthorized" };
    }

    let new_asset_amount = "";
    if (asset_amount !== "") {
      if (asset_amount === "0") {
        new_asset_amount = "";
      } else {
        new_asset_amount = asset_amount;
      }
    }

    await prisma.project.update({
      where: {
        userId,
        id: projectId,
      },
      data: { name, asset_amount: parseFloat(new_asset_amount) },
    });

    revalidateTag(`projects_user_${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to edit project:", error);
    return { error: "Failed to edit project" };
  }
};
