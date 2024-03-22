import RegularButton from "@/app/components/buttons/RegularButton";
import { ReceiptStoreStage } from "@/constants/form";
import { ReceiptInput } from "@/types/form";
import React, { useState } from "react";

interface Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: ReceiptInput;
  setStage: (stage: any) => void;
}

const TextGpt = ({ setFieldValue, values, setStage }: Props) => {
  const [inputText, setInputText] = useState("");
  const [noText, setNoText] = useState(false);
  const [help, setHelp] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promptError, setPromptError] = useState(false);
  const [apiError, setApiError] = useState(false);

  const run = async () => {
    setPrompt(false);
    setNoText(false);
    setPromptError(false);
    setApiError(false);
    setLoading(true);

    const response = await fetch("/api/gpt/analyze-input", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });

    if (!response.ok) {
      setApiError(true);
      setLoading(false);
      console.error("Failed to fetch data");

      return;
    }

    const data = await response.json();

    const itemsWithAllProperties = data.map((item: any) => ({
      description: item.description || "",
      photo: item.photo || "",
      price: item.price || 0,
      product_id: item.product_id || "",
      barcode: "",
      character: "",
    }));

    setFieldValue("items", itemsWithAllProperties);
    setStage(ReceiptStoreStage.PREVIEW);

    // const items = JSON.parse(data.choices[0].message.content);
    // if (items.error) {
    //   setLoading(false);
    //   setPromptError(true);
    //   setPrompt(false);

    //   return;
    // }
    // setFieldValue("items", items.items);
    // setPrompt(false);

    setLoading(false);
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
    <div className="flex flex-col gap-4 ">
      <button
        type="button"
        className="w-[20px] border-[1px] border-orange-600 text-orange-600 rounded"
        onClick={() => setHelp(!help)}
      >
        ?
      </button>
      {help && (
        <p className="text-sm text-center text-orange-600">
          We use AI to analyze the text you enter. Go to your online receipt or
          email and copy and paste the items from the receipt. Then click the
          &quot;Analyze&quot; button to get the items.
        </p>
      )}
      <textarea
        value={inputText}
        className="w-full border-[1px] border-emerald-900 p-2 mb-2 rounded-lg focus:outline-none h-[300px] resize-none bg"
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Copy and paste receipt items from email or website"
      />

      <RegularButton
        styles={"bg border-emerald-900 w-full"}
        handleClick={handleSubmit}
      >
        <p className="text-emerald-900 ">
          {loading ? "Analyzing..." : "Analyze Text"}
        </p>
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
      {promptError && (
        <p className="text-sm text-center text-orange-800">
          The text you&apos;ve submitted doesn&apos;t seem to be from a receipt.
          Please ensure you submit text from a valid receipt, or try providing a
          more specific part of the receipt for better recognition.
        </p>
      )}
      {noText && (
        <p className="text-sm text-center text-orange-800">
          Please enter some text to analyze. If you have a receipt, copy and
          paste the items from the receipt.
        </p>
      )}
      {apiError && (
        <p className="text-sm text-center text-orange-800">
          There was an error analyzing the text. Please try again.
        </p>
      )}
    </div>
  );
};

export default TextGpt;
