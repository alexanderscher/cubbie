// File: /pages/api/analyze-image.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { imageBase64 } = req.body; // Get the Base64 image string from the request body
    console.log(imageBase64);

    const api_key = process.env.OPENAI_API_KEY; // Your OpenAI API key

    const payload = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: "What’s in this image?", // Text content
        },
        {
          role: "user",
          content: `data:image/jpeg;base64,${imageBase64}`, // Directly the Base64 string
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

export function config() {
  return {
    runtime: "experimental-edge",
  };
}
