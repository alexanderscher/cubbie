import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const { image } = await request.json();

  const response = await openai.createChatCompletion({
    model: "gpt-4-vision-preview",
    stream: true,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        //@ts-ignore
        content: [
          {
            type: "text",
            text: 'This image should be an image of a receipt. I need you top extract the data on the receipt. Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation. Please disregard any markings made by pen or pencil. Each item on the receipt will typically be in bold text. Please focus on the bold text as the item name.  {receipt:{store:"",date_purchased:"",total_amount:"",number_of_items:"",items:[{name:"",price:"",}]}}',
          },
          {
            type: "image_url",
            image_url: image,
          },
        ],
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
