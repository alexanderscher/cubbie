import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { stripe } from "@/app/stripe/stripe";
import { revalidateTag } from "next/cache";

const webhookHandler = async (req: NextRequest): Promise<NextResponse> => {
  if (req.method !== "POST") {
    return new NextResponse(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buf = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new NextResponse(JSON.stringify({ error: "Missing signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: { message: `Webhook Error: ${err}` } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (event.type === "checkout.session.completed") {
    const stripesession = event.data.object as Stripe.Checkout.Session;
    const metadata = stripesession.metadata;
    const userId = metadata?.userId;
    const subscriptionId = metadata?.subscriptionId;

    console.log("USER ID", userId);

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          error: { message: "User ID is undefined in the metadata" },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let planId = metadata?.planId ? parseInt(metadata.planId) : null;
    if (!planId) {
      return new NextResponse(
        JSON.stringify({
          error: { message: "Plan ID is undefined in the metadata" },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.$transaction(async (prisma) => {
      // Only attempt to find and cancel an existing subscription if subscriptionId is not null
      if (subscriptionId) {
        const existingSubscription = await prisma.subscription.findUnique({
          where: { subscriptionID: subscriptionId },
        });

        if (existingSubscription && existingSubscription.subscriptionID) {
          await stripe.subscriptions.cancel(
            existingSubscription.subscriptionID
          );
          await prisma.subscription.delete({
            where: { id: existingSubscription.id },
          });
        }
      }

      // Create the new subscription
      await prisma.subscription.create({
        data: {
          subscriptionID: stripesession.subscription as string,
          planId,
          subscriptionDate: new Date(),
          userId,
        },
      });

      // Update the user's plan
      if (planId === 2) {
        await prisma.user.update({
          where: { id: userId },
          data: { planId, hasUsedTrialAdvanced: true },
        });
      } else if (planId === 3) {
        await prisma.user.update({
          where: { id: userId },
          data: { planId, hasUsedTrialLimited: true },
        });
      }

      // Revalidate user-specific data if needed
      revalidateTag(`user_${userId}`);
    });

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.userId;

    if (userId) {
      await prisma.subscription.update({
        where: { subscriptionID: subscription.id },
        data: { subscriptionID: null },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { planId: 1 },
      });

      revalidateTag(`user_${userId}`);
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    console.log(`Unhandled event type: ${event.type}`);
    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export { webhookHandler as POST };
