"use server";
import { createStripeCustomer } from "@/actions/stripe/createStripeUser";
import { stripe } from "@/app/stripe/stripe";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

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

  return stripeSession.url;
};
