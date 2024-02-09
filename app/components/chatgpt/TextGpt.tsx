import RegularButton from "@/app/components/buttons/RegularButton";
import { ReceiptInput } from "@/types/formTypes/form";
import React, { useState } from "react";

interface Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: ReceiptInput;
}

const TextGpt = ({ setFieldValue, values }: Props) => {
  const [inputText, setInputText] = useState("");
  const [noText, setNoText] = useState(false);
  const [help, setHelp] = useState(false);
  const [prompt, setPrompt] = useState(false);

  const run = async () => {
    setPrompt(false);
    setNoText(false);

    const response = await fetch("/api/gpt/analyze-input", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json();

    const itemsWithAllProperties = data.map((item: any) => ({
      description: item.description || "",
      photo: item.photo || "",
      price: item.price || 0,
      product_id: item.product_id || "",
      barcode: "",
      asset: item.hasOwnProperty("asset") ? item.asset : false,
      character: "",
    }));

    setFieldValue("items", itemsWithAllProperties);

    // const items = JSON.parse(data.choices[0].message.content);
    // setFieldValue("items", items.items);
    // console.log(items.items);
  };

  const handleSubmit = async () => {
    if (inputText === "") {
      setNoText(true);
      return;
    }

    if (values.items.length > 0) {
      setPrompt(true);
    } else {
      run();
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <button
        className="w-[20px] border-[1.5px] border-orange-400 text-orange-400 rounded-md"
        onClick={() => setHelp(!help)}
      >
        ?
      </button>
      {help && (
        <p className="text-sm text-center text-orange-400">
          We use OpenAI&apos;s GPT to analyze the text you enter. Go to your
          online receipt or email and copy and paste the items from the receipt.
          Then click the &quot;Analyze&quot; button to get the items.
        </p>
      )}
      <textarea
        value={inputText}
        className="w-full border-[1.5px] border-green-900 p-2 mb-2 rounded-md focus:outline-none h-[300px] resize-none bg"
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Copy and paste receipt items from email or website"
      />

      <RegularButton
        styles={"bg border-green-900 w-full"}
        handleClick={handleSubmit}
      >
        <p className="text-green-900">Analyze</p>
      </RegularButton>
      {prompt && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-center text-black">
            Are you sure you want to anaylze? This will overwrite your current
            items
          </p>
          <div className="flex gap-2">
            <RegularButton styles={"bg border-black w-full"} handleClick={run}>
              <p className="text-sm">Confirm</p>
            </RegularButton>
            <RegularButton
              styles={"bg border-black w-full"}
              handleClick={() => setPrompt(false)}
            >
              <p className="text-sm">Cancel</p>
            </RegularButton>
          </div>
        </div>
      )}
      {noText && (
        <p className="text-sm text-center text-orange-800">
          Please enter some text to analyze. If you have a receipt, copy and
          paste the items from the receipt.
        </p>
      )}
    </div>
  );
};

export default TextGpt;
