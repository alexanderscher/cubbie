"use server";

import { stripe } from "@/app/stripe/stripe";

export const getStripeProducts = async () => {
  try {
    const prices = await stripe.prices.list({
      limit: 4,
      active: true,
      type: "recurring",
      expand: ["data.product"],
    });

    // Filter out prices that do not meet required conditions
    const filteredPrices = prices.data.filter(
      (price) =>
        price.unit_amount !== null &&
        typeof price.product !== "string" && // Ensure product is not a string
        "metadata" in price.product && // Ensure metadata exists on the product
        Object.keys(price.product.metadata).length > 0 // Check if metadata is not empty
    );
    // Sort prices from lowest to highest with a fallback for null unit_amount
    return filteredPrices.sort(
      (a, b) =>
        (a.unit_amount ?? Number.MAX_SAFE_INTEGER) -
        (b.unit_amount ?? Number.MAX_SAFE_INTEGER)
    );
  } catch (error) {
    console.error("Failed to retrieve Stripe products:", error);
    return []; // Return an empty array or handle the error as appropriate
  }
};
