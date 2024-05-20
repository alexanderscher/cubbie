import Stripe from "stripe";

const stripeSecretKey =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY or STRIPE_SECRET_KEY_LIVE is not defined in the environment variables."
  );
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-04-10",
});
