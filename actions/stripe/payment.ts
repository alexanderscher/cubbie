"use server";
import { createStripeCustomer } from "@/actions/stripe/createStripeUser";
import { stripe } from "@/app/stripe/stripe";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { revalidateTag } from "next/cache";

async function checkSubscriptionForMetadata(customerId: string, value: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all", // Adjust according to the status you're interested in
    limit: 100, // Adjust or handle pagination if more than 100
  });

  const userSubscriptions = subscriptions.data.map((sub: any) => {
    return sub.plan.metadata.planId;
  });

  if (userSubscriptions.includes(value as string)) {
    console.log("User already has a subscription with the same plan ID.");
    return true;
  }
}

// prevent users from abusing free trial

export const handlePayment = async (priceId: string, planId: string) => {
  const session = (await auth()) as Session;
  const subscriptionId = session.user?.subscription?.subscriptionID;
  let customerId = session?.user?.stripeCustomerId;
  const userId = session.user.id;

  const url = `${process.env.NEXT_PUBLIC_URL}/subscription`;
  const home = process.env.NEXT_PUBLIC_URL;

  if (!customerId) {
    const customer = await createStripeCustomer(session.user);
    customerId = customer.id;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  // Retrieve user details from session
  const currentPlanId = session.user.planId;

  if (subscriptionId && currentPlanId === 2 && planId === "3") {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: "create_prorations",
      }
    );
    if (userId) {
      await prisma.subscription.update({
        where: { subscriptionID: subscription.id },
        data: { planId: 3 },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { planId: 3 },
      });
      const existingUserPlanUsage = await prisma.userPlanUsage.findUnique({
        where: { userId },
      });

      if (existingUserPlanUsage) {
        await prisma.userPlanUsage.update({
          where: { userId },
          data: {
            planId: 3,
            lastReset: new Date(), // Optionally update the last reset time to now
          },
        });
      }

      revalidateTag(`user_${userId}`);
    }

    console.log(
      "Successfully downgraded subscription:",
      updatedSubscription.id
    );

    await prisma.user.update({
      where: { id: session.user.id },
      data: { planId: parseInt(planId) },
    });

    revalidateTag(`user_${session.user.id}`);
    return `${url}/success`;
  }

  // Handle new subscription or upgrade path
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      hasUsedTrialLimited: true,
      hasUsedTrialAdvanced: true,
      email: true,
    },
  });

  if (!user || !user.email) {
    console.error(
      "User or email is null, cannot proceed with creating Stripe session."
    );
    return "Error: User information is incomplete.";
  }

  const hasPlanId = await checkSubscriptionForMetadata(customerId, planId);

  if (
    (planId === "2" && !user.hasUsedTrialAdvanced && !hasPlanId) ||
    (planId === "3" && !user.hasUsedTrialLimited && !hasPlanId)
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

    const subscriptionId = session.user?.subscription?.subscriptionID;

    if (subscriptionId) {
      const subscription = await prisma.subscription.findUnique({
        where: { subscriptionID: subscriptionId },
      });

      if (subscription && subscription.subscriptionID) {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.subscriptionID
        );

        if (stripeSubscription.status === "trialing") {
          console.log(
            `Attempting to cancel subscription in trial period with ID: ${subscription.subscriptionID}`
          );
          const canceledSubscription = await stripe.subscriptions.cancel(
            subscription.subscriptionID
          );
          await prisma.subscription.update({
            where: { subscriptionID: subscription.subscriptionID },
            data: { subscriptionID: null },
          });
          console.log(
            `Successfully cancelled trial subscription with ID: ${canceledSubscription.id}`
          );
        } else {
          console.log(
            `Attempting to schedule cancellation of subscription with ID: ${subscription.subscriptionID}`
          );
          const canceledSubscription = await stripe.subscriptions.update(
            subscription.subscriptionID,
            { cancel_at_period_end: true }
          );
          console.log(
            `Successfully scheduled cancellation of subscription with ID: ${canceledSubscription.id}`
          );
        }

        // Do not update subscription in the database immediately
      } else {
        console.log("No active subscription found or already cancelled.");
      }
    } else {
      console.log("No subscription found.");
    }

    revalidateTag(`user_${session.user.id}`);

    return true;
  } catch (error) {
    console.error("Error updating user to free plan:", error);
    return false;
  }
};
