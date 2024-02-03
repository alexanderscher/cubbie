import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("Request received");

  const data = `{
    "receipt": {
      "store": "Macy's FORT COLLINS FOOTHILLS FASHION",
      "date_purchased": "4/28/2012",
      "total_amount": "118.15",

      "items": [
        {
          "description": "Sperry Topslider",
          "price": "56.24",
          "barcode": ""
        },
        {
          "description": "Ralph Lauren Dress Shirt",
          "price": "29.99",
          "barcode": "092464695070"
        },
        {
          "description": "Dress Shirts",
          "price": "23.63",
          "barcode": "735897672372"
        },
        {
          "description": "Mens Polo",
          "price": "39.99",
          "barcode": ""
        }
      ]
    }
  }`;

  return new NextResponse(JSON.stringify(data), {
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
  //             text: 'This image should be an image of a receipt. I need you to extract the data on the receipt. Do not include any explanations, only provide a valid JSON response following this format without deviation. Each item on the receipt will typically be in bold text. The bar code will be a long number. This will usually be under the item name. Please focus on the bold text as the item name.  {"receipt":{"store":"","date_purchased":"","total_amount":"","items":[{"description":"","price":"","barcode":""}]}} Please do not start the object with ```json. If this does not look like a receipt, please type: "This is not a receipt."',
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
