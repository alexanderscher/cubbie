import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { stripe } from "@/app/stripe/stripe";
import { revalidateTag } from "next/cache";

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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract metadata
      const metadata = session.metadata;
      const userId = metadata?.userId;
      const planId = metadata?.planId as string;
      const projectId = metadata?.projectId;

      console.log("Subscription ID:", session.subscription);
      console.log("User ID:", userId);
      console.log("Plan ID:", planId);
      console.log("Project ID:", projectId);

      if (!userId) {
        console.error("❌ userId is undefined in the metadata");
        return new NextResponse(
          JSON.stringify({
            error: {
              message: "userId is undefined in the metadata",
            },
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
        if (parseInt(planId) === 3) {
          await prisma.subscription.deleteMany({
            where: {
              userId: userId,
              planId: {
                not: 3,
              },
            },
          });
        } else {
          await prisma.subscription.deleteMany({
            where: {
              userId: userId,
            },
          });
        }

        const subscriptionData: any = {
          subscriptionID: session.subscription as string,
          planId: parseInt(planId),
          subscriptionDate: today,
          userId: userId,
        };

        if (parseInt(planId) === 3 && projectId) {
          subscriptionData.projectId = parseInt(projectId);
        }

        await prisma.subscription.create({
          data: subscriptionData,
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            planId: parseInt(planId),
          },
        });
        revalidateTag(`user_${userId}`);
        revalidateTag(`projects_user_${userId}`);

        return new NextResponse(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
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
    } else {
      console.log(`Unhandled event type: ${event.type}`);
      return new NextResponse(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
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
