import { incrementApiCall } from "@/actions/rateLimit/gpt";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

const DATA = [
  {
    description: "Utility Shirt",
    price: "38.40",
    product_id: "7627100014004",
  },
];

export async function POST(request: Request) {
  const session = (await auth()) as Session;

  const apiCalls = await incrementApiCall();

  if (session.user.planId === 3 && apiCalls && apiCalls > 20) {
    return new NextResponse(
      JSON.stringify({
        error: "You have reached the limit of 20 API calls per week.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  if (session.user.planId === 2 && apiCalls && apiCalls > 50) {
    return new NextResponse(
      JSON.stringify({
        error: "You have reached the limit of 50 API calls per week.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  await prisma.userPlanUsage.update({
    where: {
      userId: session.user.id,
    },
    data: {
      apiCalls: {
        increment: 1,
      },
    },
  });
  return new NextResponse(JSON.stringify(DATA), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // try {
  //   const json = await request.json();
  //   console.log(json.text);
  //   const api_key = process.env.OPENAI_API_KEY;

  //   const payload = {
  //     model: "gpt-3.5-turbo-0125",
  //     response_format: { type: "json_object" },
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           'Use the title to determine if a number is a 'UPC' (barcode) or 'product id/item id'. If it's 'UPC', fill in the 'barcode' field; otherwise, use 'product_id'. If there's no title or it's unclear, treat it as 'product_id'. Format 'price' and 'total amount' as numeric values without currency symbols or text (e.g., convert 'USD 294.00' or '$294' to 294). If the text does not resemble a receipt or relate to inventory, return: {"error":"This is not a receipt."}  Format the JSON response as follows: "items":[{"description":"","price":"","product_id":""}]}} Please do not start the object with ```json. ',
  //       },
  //       {
  //         role: "user",

  //         content: `Here is the text: ${json.text}`,
  //       },
  //     ],
  //     max_tokens: 300,
  //   };

  //   const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${api_key}`,
  //     },
  //     body: JSON.stringify(payload),
  //   });

  //   const data = await response.json();
  //   console.log(data);
  //   return new NextResponse(JSON.stringify(data), {
  //     status: response.status,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // } catch (error) {
  //   console.error(error);
  //   return new NextResponse(
  //     JSON.stringify({ error: "Internal Server Error" }),
  //     {
  //       status: 500,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // }
}
