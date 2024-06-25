"use server";
import { stripe } from "@/app/stripe/stripe";

export const retrieveCustomerAndSubscriptionsByEmail = async (
  email: string
): Promise<{ customer: string | null; subscriptions: string[] } | null> => {
  try {
    let customerFound = null;

    // Retrieve all customers (paginated)
    for await (const customer of stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1,
    })) {
      customerFound = customer;
      break; // Since emails are unique per customer, we can stop at the first match
    }

    if (!customerFound) {
      console.log("No customer found with that email.");
      return null;
    }

    // Retrieve all subscriptions for the found customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerFound.id,
      status: "all", // Can be filtered by 'active', 'past_due', 'canceled', etc.
    });

    // Map through each subscription to fetch and append product details
    const detailedSubscriptions = await Promise.all(
      subscriptions.data.map(async (sub) => {
        const itemsWithProductDetails = await Promise.all(
          sub.items.data.map(async (item) => {
            const productId =
              typeof item.plan.product === "string"
                ? item.plan.product
                : item.plan.product?.id;
            const product = await stripe.products.retrieve(productId as string);
            return {
              id: item.id,
              plan: {
                id: item.plan.id,
                object: item.plan.object,
                amount: item.plan.amount,
                currency: item.plan.currency,
                interval: item.plan.interval,
                product: {
                  id: product.id,
                  name: product.name,
                  type: product.type,
                },
              },
            };
          })
        );
        return {
          id: sub.id,
          status: sub.status,
          start_date: sub.start_date,
          current_period_end: sub.current_period_end,
          items: itemsWithProductDetails,
        };
      })
    );

    const user = {
      customer: customerFound.id,
      subscriptions: [] as string[],
    };

    for (const detail of detailedSubscriptions) {
      if (detail.items.length > 0) {
        user.subscriptions.push(detail.items[0].plan.product.name);
      }
    }
    return user;
  } catch (error) {
    console.error("Error retrieving customer and subscriptions:", error);
    return null;
  }
};
