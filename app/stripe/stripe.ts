import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

if (!stripeSecretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables."
  );
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-04-10",
});
