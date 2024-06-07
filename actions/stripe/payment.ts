"use server";
import { createStripeCustomer } from "@/actions/stripe/createStripeUser";
import { stripe } from "@/app/stripe/stripe";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

export const handlePayment = async (priceId: string, planId: string) => {
  const session = (await auth()) as Session;
  const subscriptionId = session.user?.subscription?.subscriptionID;
  let customerId = session?.user?.stripeCustomerId;
  const url = "http://localhost:3000/subscription";
  const home = "http://localhost:3000/";

  if (!customerId) {
    const customer = await createStripeCustomer(session.user);
    customerId = customer.id;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const hasFreeTrial = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hasUsedTrialLimited: true, hasUsedTrialAdvanced: true },
  });

  if (
    (planId === "2" &&
      hasFreeTrial &&
      hasFreeTrial.hasUsedTrialAdvanced === false) ||
    (planId === "3" &&
      hasFreeTrial &&
      hasFreeTrial.hasUsedTrialLimited === false)
  ) {
    const stripeSession = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      customer: customerId,
      subscription_data: {
        trial_period_days: 14,
      },
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
      cancel_url: `${home}/manage-plan`,
    });
    revalidateTag(`user_${session.user.id}`);
    console.log(stripeSession.url);

    return stripeSession.url;
  } else {
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
      cancel_url: `${home}/manage-plan`,
    });
    revalidateTag(`user_${session.user.id}`);

    return stripeSession.url;
  }
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

    const subscriptionId = session.user?.subscription?.subscriptionID;

    if (subscriptionId) {
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

        await prisma.subscription.update({
          where: { subscriptionID: subscriptionId },
          data: { subscriptionID: null },
        });
      } else {
        console.log("No active subscription found or already cancelled.");
      }
    } else {
      console.log("No subscription found.");
    }

    const userId = session.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: { planId: 1 },
    });
    const existingUserPlanUsage = await prisma.userPlanUsage.findUnique({
      where: { userId },
    });

    if (existingUserPlanUsage) {
      await prisma.userPlanUsage.update({
        where: { userId },
        data: {
          planId: 1,
          apiCalls: 0, // Resetting the API call count to zero
          lastReset: new Date(), // Optionally update the last reset time to now
        },
      });
    } else {
      await prisma.userPlanUsage.create({
        data: {
          userId,
          planId: 1,
          apiCalls: 0, // Assuming starting from zero
          lastReset: new Date(), // Assuming it resets now
        },
      });
    }

    // Optional: Tag revalidation if necessary
    revalidateTag(`user_${session.user.id}`);

    return true;
  } catch (error) {
    console.error("Error updating user to free plan:", error);
    return false;
  }
};
