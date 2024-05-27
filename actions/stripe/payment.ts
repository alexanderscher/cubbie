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
  const subscriptionId = session.user?.subscription?.subscriptionID;
  let customerId = session?.user?.stripeCustomerId;
  const url = "http://localhost:3000/subscriptions";

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
      subscriptionId: subscriptionId,
    },
    mode: "subscription",
    success_url: `${url}/success`,
    cancel_url: `${url}/cancel`,
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

    // Ensure there is a way to handle if subscription data is not readily available in session
    const subscriptionId = session.user?.subscription?.subscriptionID; // Adjusted for potential nulls

    if (!subscriptionId) {
      console.log("No subscription found.");
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: { subscriptionID: subscriptionId },
    });

    if (subscription && subscription.subscriptionID) {
      console.log(
        `Attempting to cancel subscription with ID: ${subscription.subscriptionID}`
      );
      const canceledSubscription = await stripe.subscriptions.cancel(
        subscription.subscriptionID
      );
      console.log(
        `Successfully cancelled subscription with ID: ${canceledSubscription.id}`
      );

      // Consider whether you want to delete or update the subscription record to reflect cancellation
      await prisma.subscription.delete({
        where: { id: subscription.id },
      });
    } else {
      console.log("No active subscription found or already cancelled.");
    }

    // Update user to a free plan
    await prisma.user.update({
      where: { id: session.user.id },
      data: { planId: 1 }, // Assuming '1' signifies the free plan
    });

    // Optional: Tag revalidation if necessary
    revalidateTag(`user_${session.user.id}`);
  } catch (error) {
    console.error("Error updating user to free plan:", error);
  }
};
