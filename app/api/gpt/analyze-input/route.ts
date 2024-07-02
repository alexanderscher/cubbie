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

const PROMPT = `
Objective: Parse email receipts inputted by users and extract relevant information to output in JSON format.

Instructions:

1. Store Name:
    - Identify the store name from the input text.
    - The store name will be at the start of the text.
    - Examples:
        - 'Amazon' in 'Amazon Order Confirmation'.
        - 'Amazon' in 'Amazon Customer Service'.
        - 'Amazon' in 'Thank you for shopping at Amazon'.

2. Date of Purchase:
    - Identify the date of purchase from the input text.
    - The date could be in various formats, such as '7 February 2024', 'Feb 7, 2024', etc.
    - Examples:
        - '7 February 2024' in '7 February 2024 - Order Confirmation'.
        - '7 February 2024' in 'Order Confirmation - 7 February 2024'.
        - 'Wed, Feb 7, 2024 at 10:24 AM'.

3. Item Identifier:
   - Examine the title or description of each item to determine its identifier type.
   - If the title explicitly states 'UPC', classify the number following it as a 'barcode'.
   - If the title states 'product id' or 'item id', or if there is no title, classify the number as 'product_id'.
   - Example titles:
        - 'UPC: 123456789012'.
        - 'Product ID: 12345'.

4. Format Numerical Values:
   - Convert 'price' and 'total amount' to numeric values. Remove any currency symbols or accompanying text.
   - Examples:
        - 'USD 294.00' or '$294' should be converted to 294.

5. JSON Formatting:
   - Format the extracted data into a JSON structure as follows:
     {
       "store": "Store Name Here",
       "date_purchased": "Date of Purchase Here",
       "total_amount": "Total Amount Here",
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

6. Error Handling:
   - If the input text does not resemble a receipt or is unrelated to inventory items, return an error in JSON format:
     {"error": "This is not a receipt."}

Edge Case Considerations:
- If a product description or price is missing, ensure fields are still present in the JSON but left empty or filled with a default value (e.g., null or 0).
`;

export async function POST(request: Request) {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const planId = session.user.planId;
  const body = await request.json();

  const { projectId, projectOwner, text } = body;

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
    const api_key = process.env.OPENAI_API_KEY;

    if (!api_key) {
      console.error("OpenAI API key is missing.");
      return new NextResponse(
        JSON.stringify({ error: "OpenAI API key is missing." }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const payload = {
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        {
          role: "user",
          content: `Here is the text: ${text}`,
        },
      ],
      max_tokens: 300,
    };

    console.log("Payload:", payload);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Fetch response was not ok:", response.statusText);
      return new NextResponse(
        JSON.stringify({ error: "Failed to fetch from OpenAI API." }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

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
