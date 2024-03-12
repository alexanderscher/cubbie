import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
// import Stripe from "stripe";
import prisma from "@/prisma/client";

// const isProduction = process.env.NODE_ENV === "production";

// const stripeSecretKey = isProduction
//   ? process.env.STRIPE_SECRET_KEY_LIVE
//   : process.env.STRIPE_SECRET_KEY;

// if (!stripeSecretKey) {
//   throw new Error("STRIPE_SECRET_KEY is not set in the environment variables.");
// }

// const stripeId = async (user: any, email: string, name: string) => {
//   const stripe = new Stripe(stripeSecretKey!, {
//     apiVersion: "2023-10-16",
//   });
//   const customer = await stripe.customers.create({
//     email: user.email.toLowerCase()!,
//     name: user.name,
//   });
//   console.log(customer);

//   await prisma.user.update({
//     where: { id: user.id },
//     data: {
//       stripeCustomerId: customer.id,
//     },
//   });
// };

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { provider, email, password } = body.data;
    console.log(provider);

    if (provider && provider === "Google") {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      let user;
      if (existingUser) {
        user = existingUser;
      } else {
        // const stripe = new Stripe(stripeSecretKey!, {
        //   apiVersion: "2023-10-16",
        // });
        // const customer = await stripe.customers.create({
        //   email: email.toLowerCase()!,
        //   name: name,
        // });
        // stripeId(user, email, name);
        // revalidateTag("users");
        user = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            password: "",
          },
        });
      }

      return new NextResponse(JSON.stringify(user), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      if (!email || !password) {
        return new NextResponse(JSON.stringify({ error: "Missing fields" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        return new NextResponse(
          JSON.stringify({ error: "Invalid email format" }),
          {
            status: 422,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (existingUser) {
        return new NextResponse(
          JSON.stringify({ error: "User already exists" }),
          {
            status: 409,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });

      //   stripeId(user, email, name);
      //   revalidateTag("users");

      return new NextResponse(JSON.stringify(user), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
