"use server";

import { stripe } from "@/app/stripe/stripe";

export const getStripeProducts = async () => {
  const prices = await stripe.prices.list({
    limit: 4,
    active: true,
    type: "recurring",
    expand: ["data.product"],
  });
  return prices.data;
};
