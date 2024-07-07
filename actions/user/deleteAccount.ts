"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { stripe } from "@/app/stripe/stripe";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

export const deleteAccount = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const transaction = await prisma.$transaction(async (prisma) => {
    const projects = await prisma.project.findMany({
      where: { userId: userId },
      include: {
        receipts: {
          include: {
            items: true,
          },
        },
      },
    });

    await Promise.all(
      projects.map(async (project) => {
        await Promise.all(
          project.receipts.map(async (receipt) => {
            if (receipt.receipt_image_key) {
              await deleteUploadThingImage(receipt.receipt_image_key);
            }
            await Promise.all(
              receipt.items.map(async (item) => {
                if (item.photo_key) {
                  await deleteUploadThingImage(item.photo_key);
                }
              })
            );
          })
        );
      })
    );

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription && subscription.subscriptionID) {
      await stripe.subscriptions.cancel(subscription.subscriptionID);
    } else {
      console.log("No subscription found for the user.");
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidateTag(`projects_user_${userId}`);
    revalidateTag(`user_${userId}`);
    revalidateTag(`alerts_user_${userId}`);
  });

  try {
    await transaction;
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "An error occurred during account deletion" };
  }
};
