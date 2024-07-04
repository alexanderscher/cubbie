import { appendApiUsage, canMakeRequest } from "@/actions/rateLimit/gpt";
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
        - 'Amazon' in 'From Amazon'
        - 'Amazon' in 'Amazon Order Confirmation'.
        - 'Amazon' in 'Amazon Customer Service'.
        - 'Amazon' in 'Thank you for shopping at Amazon'.

2. Date of Purchase:
    - Identify the date of purchase from the input text.
    - The date could be in various formats, such as '7 February 2024', 'Feb 7, 2024', etc.
    - Examples:
        - '7 February 2024' in 'Date: 7 February 2024'.
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
       "receipt": {
         "store": "Store Name Here",
         "date_purchased": "YYYY-MM-DD",
         "total_amount": "Total Amount Here",
         "items": [
           {
             "description": "Item description here",
             "price": "numeric value here",
             "barcode": "if applicable"
           }
         ]
       }
     }
   - Include 'barcode' only if identified; otherwise, include 'product_id'.
   - **Please do not start the object with \`\`\`json**


6. Error Handling:
   - If the content does not resemble a receipt, respond with an error in string format: "Error: This is not a receipt."

Edge Case Considerations:
- If a product description or price is missing, ensure fields are still present in the JSON but left empty or filled with a default value (e.g., null or 0).
`;

export async function POST(request: Request) {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const planId = session.user.planId;
  const body = await request.json();

  const { projectId, projectOwner, input } = body;

  const apiCalls = await canMakeRequest(userId, parseInt(projectId), planId);

  if (apiCalls.status === "500" || apiCalls.status === "429") {
    return new NextResponse(JSON.stringify({ error: apiCalls.message }), {
      status: parseInt(apiCalls.status),
      headers: { "Content-Type": "application/json" },
    });
  }
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
          content: `Here is the text: ${input}`,
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
      console.error("OpenAI API Error:", response.statusText);
      let errorMsg = `OpenAI API error: ${response.status}`;

      // Attempt to parse error response from OpenAI
      try {
        const errorData = await response.json();
        errorMsg += ` - ${errorData.error.message}`;
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
      }

      return new NextResponse(JSON.stringify({ error: errorMsg }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let data;

    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      return new NextResponse(
        JSON.stringify({
          error: "Failed to parse JSON response from OpenAI API.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

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
