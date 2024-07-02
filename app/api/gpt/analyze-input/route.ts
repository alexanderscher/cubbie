import { canMakeRequest } from "@/actions/rateLimit/gpt";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

// const DATA = [
//   {
//     description: "Utility Shirt",
//     price: "38.40",
//     product_id: "7627100014004",
//   },
// ];

// export async function POST(request: Request) {
//   const session = (await auth()) as Session;
//   const userId = session?.user?.id as string;
//   const planId = session.user.planId;
//   const body = await request.json();

//   const { projectId, projectOwner } = body;
//   const requestPayload = {};

//   const apiCalls = await canMakeRequest(
//     userId,
//     parseInt(projectId),
//     planId,
//     "analyze-input",
//     projectOwner
//   );

//   if (apiCalls.status === "500") {
//     return new NextResponse(
//       JSON.stringify({
//         error: apiCalls.message,
//       }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
//   if (apiCalls.status === "429") {
//     return new NextResponse(
//       JSON.stringify({
//         error: apiCalls.message,
//       }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
//   return new NextResponse(JSON.stringify(DATA), {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// const DATA = [
//   {
//     description: "Utility Shirt",
//     price: "38.40",
//     product_id: "7627100014004",
//   },
// ];
const PROMPT = `Objective: Parse email receipts inputted by users and extract relevant information to output in JSON format.

Instructions:
1. Identify Item Identifier:
   - Examine the title of each item to determine its identifier type.
   - If the title explicitly states 'UPC', classify the number following it as a 'barcode'.
   - If the title states 'product id' or 'item id', or if there is no title, classify the number as 'product_id'.
   - Example titles: 'UPC: 123456789012', 'Product ID: 12345'.

2. Format Numerical Values:
   - Convert 'price' and 'total amount' to numeric values. Remove any currency symbols or accompanying text.
   - Example conversions: 'USD 294.00' or '$294' should be converted to 294.

3. JSON Formatting:
   - Format the extracted data into a JSON structure as follows:
     {
       "items": [
         {
           "description": "Item description here",
           "price": "numeric value here",
           "product_id": "if applicable",
           "barcode": "if applicable"
         }
       ]
     }
   - Include 'barcode' only if identified; otherwise, include 'product_id'.
   - Please do not start the object with \`\`\`json.

4. Error Handling:
   - If the input text does not resemble a receipt or is unrelated to inventory items, return an error in JSON format:
     {"error": "This is not a receipt."}

Example Input:
Item: ABC Widget
Product ID: 12345
Price: USD 294.00
Total: $588
Quantity: 2

Expected JSON Output:
{
  "items": [
    {
      "description": "ABC Widget",
      "price": 294,
      "product_id": "12345"
    }
  ]
}

Edge Case Consideration:
- If a product description or price is missing, ensure fields are still present in the JSON, but left empty or filled with a default value (e.g., null or 0).`;

export async function POST(request: Request) {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const planId = session.user.planId;
  const body = await request.json();

  const { projectId, projectOwner } = body;

  const apiCalls = await canMakeRequest(
    userId,
    parseInt(projectId),
    planId,
    "analyze-input",
    projectOwner
  );

  console.log("API Call status:", apiCalls.status);

  if (apiCalls.status === "500") {
    return new NextResponse(
      JSON.stringify({
        error: apiCalls.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  if (apiCalls.status === "429") {
    return new NextResponse(
      JSON.stringify({
        error: apiCalls.message,
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
    console.log("Request JSON:", json);

    const api_key = process.env.OPENAI_API_KEY;

    const payload = {
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        {
          role: "user",
          content: `Here is the text: ${json.text}`,
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
    console.log("Response from OpenAI:", data);

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
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
