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
  if (req.method !== "POST") {
    return new NextResponse(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
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
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
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
    const subscriptionId = subscription.id;
    const planId = subscription.items.data[0].plan.product as string;

    // Fetch product to get the planId from metadata
    const product = await stripe.products.retrieve(planId);
    const planMetadataId = product.metadata.planId;

    console.log("Subscription ID:", planMetadataId);

    try {
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
          await prisma.user.update({
            where: {
              stripeCustomerId: subscription.customer as string,
            },
            data: {
              subscriptionID: subscriptionId,
              planId: parseInt(planMetadataId),
              subscriptionDate: today,
            },
            include: { plan: true },
          });
          break;
        // case "customer.subscription.deleted":
        //   const updated = await prisma.user.update({
        //     where: {
        //       stripeCustomerId: subscription.customer as string,
        //     },
        //     data: {
        //       subscriptionID: subscriptionId,
        //       planId: parseInt(planMetadataId),
        //       subscriptionDate: null,
        //     },
        //     include: { plan: true },
        //   });
        //   console.log("Updated User (deleted):", updated);
        //   break;
        default:
          console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
          break;
      }
    } catch (dbError) {
      console.error(`❌ Database error: ${dbError}`);
      return new NextResponse(
        JSON.stringify({
          error: {
            message: `Database Error: ${dbError}`,
          },
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`❌ Unexpected error: ${error}`);
    return new NextResponse(
      JSON.stringify({
        error: {
          message: `Unexpected Error`,
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export { webhookHandler as POST };
