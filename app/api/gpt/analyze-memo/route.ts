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
  //             text: 'This image should be an image of a pdf online receipt (memo form). I need you to extract the data on the receipt. Do not include any explanations, only provide a valid JSON response following this format without deviation. The store name will be somewhere at the top. It can be in bold, larger font, or it will say from: store name. There will also be a product id or a upc barcode. If the title says UPC, fill it in the barcode field. If it says prodcut id or item idm please fill it in the product_id field. I need the price and total amount to be only the number values. For example if the price or total amount you read is USD 294.00 please change it to 294. Please fill in the data like this: {"receipt":{"store":"","date_purchased":"","total_amount":"","items":[{"description":"","price":"","barcode":"", product_id:""}]}} Please do not start the object with ```json. If this does not look like a receipt, please type: "This is not a receipt."',
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
