import Stripe from "stripe";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { stripe } from "@/app/stripe/stripe";

const isProduction = process.env.NODE_ENV === "production";

const webhookSecret: string = isProduction
  ? process.env.STRIPE_WEBHOOK_SECRET_PRODUCTION!
  : process.env.STRIPE_WEBHOOK_SECRET!;

const today = new Date();

const webhookHandler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);

      return new NextResponse(
        JSON.stringify({
          error: {
            message: `Webhook Error: ${errorMessage}`,
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("✅ Success:", event.id);

    const subscription = event.data.object as Stripe.Subscription;
    const planNickname = subscription.items.data[0].plan.nickname;

    const subscriptionId = subscription.id;

    switch (event.type) {
      case "customer.subscription.created":
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            subscriptionID: subscriptionId,
            subscriptionType: planNickname,
            subscriptionDate: today,
          },
        });
        break;
      case "customer.subscription.updated":
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            subscriptionID: subscriptionId,
            subscriptionType: planNickname,
            subscriptionDate: today,
          },
        });
        break;
      case "customer.subscription.deleted":
        const updateed = await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },

          data: {
            subscriptionType: null,
            subscriptionDate: null,
          },
        });
        console.log("Updated User (deleted):", updateed);

        break;
      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const response = new NextResponse(
      JSON.stringify({
        error: {
          message: `Method Not Allowed`,
        },
      }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );

    response.headers.set("Allow", "POST");
    return response;
  }
};

export { webhookHandler as POST };
