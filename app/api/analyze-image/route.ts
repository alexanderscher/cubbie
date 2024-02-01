import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
              text: 'This image should be an image of a receipt. I need you top extract the data on the receipt. Do not include any explanations, only provide a valid JSON response following this format without deviation. Please disregard any markings made by pen or pencil. Each item on the receipt will typically be in bold text. Please focus on the bold text as the item name.  {receipt:{store:"",date_purchased:"",total_amount:"",receipt_barcode:"",items:[{name:"",price:"",item_barcode:""}]}} Please do not start the object with ``json',
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
