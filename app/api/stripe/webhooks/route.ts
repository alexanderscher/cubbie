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
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;
    const userId = metadata?.userId;

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
      const existingSubscriptions = await prisma.subscription.findMany({
        where: { userId },
      });

      // Cancel and delete existing subscriptions not matching the new plan ID
      for (const subscription of existingSubscriptions) {
        if (subscription.subscriptionID) {
          await stripe.subscriptions.cancel(subscription.subscriptionID);
          await prisma.subscription.delete({ where: { id: subscription.id } });
        }
      }

      // Verify no active subscriptions exist before creating a new one
      const activeSubscriptions = await prisma.subscription.findMany({
        where: { userId },
      });
      if (activeSubscriptions.length === 0) {
        await prisma.subscription.create({
          data: {
            subscriptionID: session.subscription as string,
            planId,
            subscriptionDate: new Date(),
            userId,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { planId },
        });
        revalidateTag(`user_${userId}`);
      }
    });

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
