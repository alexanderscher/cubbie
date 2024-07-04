import { appendApiUsage, canMakeRequest } from "@/actions/rateLimit/gpt";
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

const PROMPT = `
Objective: Extract data from an image of a receipt, focusing on the most prominently displayed text for item names, regardless of whether it is bolded.

Instructions:

1. Store Name:
    - Identify the store name from the image of the receipt.
    - The store name is usually at the top of the receipt.

2. Date of Purchase:
    - Identify the date of purchase from the receipt.
    - The date should be formatted in YYYY-MM-DD.
    - Examples:
        - '2024-02-07' for '7 February 2024'.
        - '2024-02-07' for 'Feb 7, 2024'.

3. Total Amount:
    - Identify the total amount from the receipt.
    - Convert the amount to a numeric value, removing any currency symbols or textual descriptions.
    - Examples:
        - 'USD 294.00' or '$294' should be converted to 294.

4. Item Details:
   - Extract details of each item listed on the receipt.
   - Include the description, price, and barcode for each item.
   - If the title explicitly states 'UPC', classify the number following it as a 'barcode'.
   - If a barcode is present, include it; otherwise, omit it.
   - Examples:
        - Description: "Item description here"
        - Price: "numeric value here"
        - Barcode: "123456789012" (if applicable)

5. Handling Multiple Items:
   - Ensure that duplicate items are explicitly included if they appear multiple times on the receipt.

6. Format Numerical Values:
   - Convert 'price' and 'total amount' to numeric values, removing any currency symbols or accompanying text.
   - Examples:
        - 'USD 294.00' or '$294' should be converted to 294.
   - If you cannot read the price, input it as 0.

7. JSON Formatting:
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
   - **Please do not start the object with \`\`\`json**

8. Error Handling:
   - If the content does not resemble a receipt, respond with an error in string format: "Error: This is not a receipt."

Edge Case Considerations:
- Handle different layouts and formats of receipts, including digital and physical copies.
- Adjust for any visible special characters or formatting issues.
- If a product description or price is missing, ensure fields are still present in the JSON but left empty or filled with a default value (e.g., null or 0).
`;

export async function POST(request: Request) {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  const planId = session.user.planId;
  const json = await request.json();

  const { projectId, projectOwner, input } = json;

  const apiCalls = await canMakeRequest(userId, parseInt(projectId), planId);

  if (apiCalls.status === "500" || apiCalls.status === "429") {
    return new NextResponse(JSON.stringify({ error: apiCalls.message }), {
      status: parseInt(apiCalls.status),
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const api_key = process.env.OPENAI_API_KEY;

    const payload = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: PROMPT,
            },
            {
              type: "image_url",
              image_url: input,
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
      const responseBody = await response.text();
      const cleanedResponse = responseBody
        .trim()
        .replace(/```json\s*|\s*```/g, "");
      data = JSON.parse(cleanedResponse);
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

//   const data = await response.json();

//   return new NextResponse(JSON.stringify(data), {
//     status: response.status,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// } catch (error) {
//   console.error("error", error);
//   return new NextResponse(
//     JSON.stringify({
//       error:
//         "There was an error anazlying your image. Please contact support if this issue persists.",
//     }),
//     {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }
// }
