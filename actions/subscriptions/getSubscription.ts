"use server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export const getSubscription = async (subId: string) => {
  const session = (await auth()) as Session;

  if (session && session.user) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });
    if (user && user.subscription?.subscriptionID === subId) {
      return user.subscription;
    }
  }
};
