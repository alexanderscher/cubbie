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
  revalidateTag(`user_${session.user.id}`);

  return stripeSession.url;
};

export const handlePaymentIndividual = async (
  priceId: string,
  projectId: string,
  planId: number
) => {
  console.log("PROJECTID:", projectId);
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
    mode: "subscription",
    metadata: {
      projectId: projectId,
      userId: session.user.id,
      planId: planId,
    },
    success_url: `${url}`,
    cancel_url: `${url}`,
  });
  revalidateTag(`user_${session.user.id}`);
  revalidateTag(`projects_user_${session.user.id}`);

  return stripeSession.url;
};

export const cancelIndividual = async (subscription: Subscription) => {
  try {
    const session = (await auth()) as Session;

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    // Cancel the subscription in Stripe
    const sub = await stripe.subscriptions.cancel(
      subscription.subscriptionID as string
    );

    // Delete the subscription from the database
    const deleteSub = await prisma.subscription.delete({
      where: { id: subscription.id },
    });

    // Fetch updated user subscriptions after deletion
    const userSubscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
    });

    // If user has no more subscriptions, create a default subscription
    if (deleteSub && userSubscriptions.length === 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { planId: 1 },
      });
    }

    // Revalidate any necessary data
    revalidateTag(`user_${session.user.id}`);
    revalidateTag(`projects_user_${session.user.id}`);

    return { message: "Subscription canceled successfully", subscription: sub };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw new Error(`Subscription cancellation failed: ${error}`);
  }
};
