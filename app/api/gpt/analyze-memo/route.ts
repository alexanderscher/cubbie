import { NextResponse } from "next/server";

const DATA = `{"receipt":{"store":"Caron Callahan","date_purchased":"10 JAN 2024","total_amount":"1302","items":[{"description":"AUGIE JACKET","price":"294","product_id":"SS24-C5063"},{"description":"CARISI PANT","price":"206.5","product_id":"H24-CC3098"},{"description":"CARISI PANT","price":"231","product_id":"H24-CC3098"},{"description":"DEXTER PANT","price":"276.5","product_id":"FW23-CC3086"},{"description":"FLETCHER SWEATER","price":"294","product_id":"FW23-CC9052-5"}]}}`;

export async function POST(request: Request) {
  return new NextResponse(JSON.stringify(DATA), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // try {
  //   const json = await request.json();
  //   const image = json.image;
  //   const api_key = process.env.OPENAI_API_KEY;
  //   const payload = {
  //     model: "gpt-4-vision-preview",
  //     messages: [
  //       {
  //         role: "user",
  //         //@ts-ignore
  //         content: [
  //           {
  //             type: "text",
  //             text: 'The store name should be extracted from the top of the receipt, which may be in bold, a larger font, or indicated with 'from: store name'. Identify product details based on titles: use 'barcode' for UPCs and 'product_id' for product or item IDs. If a title is absent or unclear and does not specify as a UPC number, classify it under 'product_id'. Convert 'price' and 'total amount' to numeric values only. Remove any currency symbols or textual descriptions (e.g., 'USD 294.00' or '$294' becomes 294). Format the JSON response as follows: {"receipt":{"store":"","date_purchased":"","total_amount":"","items":[{"description":"","price":"","barcode":"", product_id:""}]}} Please do not start the object with ```json. If the image does not represent a receipt or relate to inventory data, respond with: {"error":"This is not a receipt."}',
  //           },
  //           {
  //             type: "image_url",
  //             image_url: image,
  //           },
  //         ],
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
