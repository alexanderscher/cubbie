import { stripe } from "@/app/stripe/stripe";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export const handlePayment = async (priceId: string) => {
  const session = (await auth()) as Session;
  const sessionId = session?.user?.id as string;
  const url = "http://localhost:3000";
  const stripeSession = await stripe.checkout.sessions.create({
    allow_promotion_codes: true,
    customer: sessionId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${url}/success`,
    cancel_url: `${url}/cancel`,
  });
};
