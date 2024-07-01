import { canMakeRequest } from "@/actions/rateLimit/gpt";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

// const DATA = `{"receipt":{"store":"Caron Callahan","date_purchased":"10 JAN 2024","total_amount":"1302","items":[{"description":"AUGIE JACKET","price":"294","product_id":"SS24-C5063"},{"description":"CARISI PANT","price":"206.5","product_id":"H24-CC3098"},{"description":"CARISI PANT","price":"231","product_id":"H24-CC3098"},{"description":"DEXTER PANT","price":"276.5","product_id":"FW23-CC3086"},{"description":"FLETCHER SWEATER","price":"294","product_id":"FW23-CC9052-5"}]}}`;

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
        status: 500,
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
              text: 'Please analyze the attached image of a receipt memo and extract the following details: the store name, the date of purchase, and the total amount. For each item listed on the receipt memo, extract the item name, its price (using the discounted price if available), the UPC code (if available), and the product ID. Ensure that duplicate items are explicitly included if they appear multiple times on the receipt. Remove any currency symbols or textual descriptions of the prices, converting them to plain numbers (e.g., \'USD 294.00\' or \'$294\' becomes 294). If you cannot read the price, input it as 0. Format the JSON response as follows: {"receipt":{"store":"","date_purchased":"","total_amount":"","items":[{"description":"","price":"","barcode":""}]}} Please do not start the object with ```json.. If the image does not represent a receipt or relate to inventory data, respond with: {\'error\':\'This is not a receipt.\'} Please do not start the object with ```json.  Note: This request is specifically for receipt memos, which may look different from standard in-store receipts. This API is distinct from another service that handles physical in-store receipts, and the format for each memo is unique but contains consistent content.',
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
      JSON.stringify({
        error:
          "There was an error anazlying your image. Please contact support if this issue persists.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
