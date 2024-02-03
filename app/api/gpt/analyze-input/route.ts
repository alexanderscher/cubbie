import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("Request received");
  try {
    const json = await request.json();
    console.log(json.text);
    const api_key = process.env.OPENAI_API_KEY;

    const payload = {
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You are a helpful assistant designed to output JSON. This is text of an online email receipt. Please parse it and return the JSON object. Please do not include any explanations, only provide a valid JSON response following this format without deviation. It should look like this: "items":[{"name":"","price":"","item_barcode":""}]}} Please do not start the object with ```json. If this does not look like a receipt, please type: "This is not a receipt."',
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
    console.log(data);
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
