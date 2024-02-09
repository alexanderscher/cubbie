import { NextResponse } from "next/server";

// const DATA = `{
//     "receipt": {
//       "store": "Macy's FORT COLLINS FOOTHILLS FASHION",
//       "date_purchased": "4/28/2012",
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
  // return new NextResponse(JSON.stringify(DATA), {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  try {
    const json = await request.json();
    const image = json.image;
    const api_key = process.env.OPENAI_API_KEY;

    const payload = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          //@ts-ignore

          content: [
            {
              type: "text",
              text: 'This image should be an image of a pdf online receipt (memo form). I need you to extract the data on the receipt. Do not include any explanations, only provide a valid JSON response following this format without deviation. The store name will be somewhere at the top. It can be in bold, larger font, or it will say from: store name. There will also be a product id or a upc barcode. If the title says UPC, fill it in the barcode field. If it says prodcut id or item idm please fill it in the product_id field. I need the price and total amount to be only the number values. For example if the price or total amount you read is USD 294.00 please change it to 294. Please fill in the data like this: {"receipt":{"store":"","date_purchased":"","total_amount":"","items":[{"description":"","price":"","barcode":"", product_id:""}]}} Please do not start the object with ```json. If this does not look like a receipt, please type: "This is not a receipt."',
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
    console.error(error);
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
