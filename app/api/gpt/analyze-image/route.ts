import { incrementApiCall } from "@/actions/rateLimit/gpt";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

// const DATA = `{
//     "receipt": {
//       "store": "Macy's FORT COLLINS FOOTHILLS FASHION",
//       "date_purchased": "2024-05-20",
//       "total_amount": "118.15",

//       "items": [
//         {
//           "description": "Sperry Topslider",
//           "price": "56.24",
//           "barcode": ""
//         },
//         {
//           "description": "Ralph Lauren Dress Shirt",
//           "price": "29.99",
//           "barcode": "092464695070"
//         },
//         {
//           "description": "Dress Shirts",
//           "price": "23.63",
//           "barcode": "735897672372"
//         },
//         {
//           "description": "Mens Polo",
//           "price": "39.99",
//           "barcode": ""
//         }
//       ]
//     }
//   }`;

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
  try {
    const json = await request.json();
    const image = json.image;
    const api_key = process.env.OPENAI_API_KEY;

    const payload = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Extract data from an image of a receipt, focusing on the most prominently displayed text for item names, regardless of whether it is bolded. Include the store name, purchase date in YYYY-MM-DD format, total amount, and each item\'s description, price, and barcode (noted as a long number typically found under or beside the item name). Ensure that duplicate items are explicitly included if they appear multiple times on the receipt. {"receipt":{"store":"","date_purchased":"","total_amount":"","items":[{"description":"","price":"","barcode":""}]}} Please do not start the object with ```json. If the content does not resemble a receipt, type: "This is not a receipt." Please handle different layouts and formats of receipts, including digital and physical copies, and adjust for any visible special characters or formatting issues.',
            },
            {
              type: "image_url",
              image_url: image,
            },
          ],
        },
      ],
      max_tokens: 300,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("error", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
