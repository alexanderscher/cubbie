"use server";
import { stripe } from "@/app/stripe/stripe";

export const createStripeCustomer = async (user: any) => {
  const email = user.email.toLowerCase();
  const customer = await stripe.customers.create({
    email: email,
    name: user.name,
  });
  return customer;
};
