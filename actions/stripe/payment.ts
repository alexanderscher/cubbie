"use server";
import { createStripeCustomer } from "@/actions/stripe/createStripeUser";
import { stripe } from "@/app/stripe/stripe";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { Subscription } from "@prisma/client";
import { revalidateTag } from "next/cache";

export const handlePayment = async (priceId: string, planId: number) => {
  const session = (await auth()) as Session;
  let customerId = session?.user?.stripeCustomerId;
  const url = "http://localhost:3000";

  if (!customerId) {
    const customer = await createStripeCustomer(session.user);
    customerId = customer.id;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    allow_promotion_codes: true,
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      planId: planId,
    },
    mode: "subscription",
    success_url: `${url}`,
    cancel_url: `${url}`,
  });
  revalidateTag(`user_${session.user.id}`);

  return stripeSession.url;
};

export const freePlan = async () => {
  try {
    const session = (await auth()) as Session;
    let customerId = session?.user?.stripeCustomerId;

    if (!customerId) {
      const customer = await createStripeCustomer(session.user);
      customerId = customer.id;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
    });

    for (const subscription of subscriptions) {
      if (subscription.subscriptionID) {
        await stripe.subscriptions.cancel(subscription.subscriptionID);
      }
    }

    await prisma.subscription.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        planId: 1,
      },
    });

    revalidateTag(`user_${session.user.id}`);
  } catch (error) {
    console.error("Error updating user to free plan:", error);
  }
};
