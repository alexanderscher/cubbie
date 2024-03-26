import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import Loading from "@/components/Loading";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import { ReceiptStoreStage } from "@/constants/form";
import { ReceiptInput } from "@/types/form";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { set } from "date-fns";
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
      setPrompt(false);
      return;
    }
    if (values.items.length > 0) {
      setPrompt(true);
      setNoText(false);
      return;
    }

    run();
  };
  return (
    <div className="flex flex-col gap-4 mb-[200px]">
      <TooltipWithHelperIcon
        content='We use AI to analyze the text you enter. Go to your online receipt or
          email and copy and paste the items from the receipt. Then click the
          "Analyze" button to get the items.'
      />

      <textarea
        value={inputText}
        className="w-full border-[1px] p-2 mb-2 rounded  h-[300px] resize-none bg border-slate-400 focus:border-emerald-900 focus:outline-none"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          {/* Modal Content */}
          <div className="flex flex-col gap-4 mt-10 bg-orange-200 p-6 rounded-md shadow items-center justify-center w-3/4 text-emerald-900 max-w-lg">
            <ExclamationTriangleIcon className="h-6 w-1/6" />
            <p className="text-sm text-center text-emerald-900">
              Are you sure you want to analyze the image? This will overwrite
              your current data.
            </p>
            <div className="flex flex-col gap-2 w-full">
              <RegularButton
                styles="bg-orange-200 border-emerald-900 text-emerald-900 w-full"
                handleClick={() => {
                  run();
                  setPrompt(false);
                }}
              >
                <p className="text-xs">Confirm</p>
              </RegularButton>
              <RegularButton
                styles="bg-orange-200 border-emerald-900 text-emerald-900 w-full"
                handleClick={() => setPrompt(false)}
              >
                <p className="text-xs">Cancel</p>
              </RegularButton>
            </div>
          </div>
        </div>
      )}
      {promptError && (
        <FormError
          message={
            "The text you&apos;ve submitted doesn&apos;t seem to be from a receipt. Please ensure you submit text from a valid receipt, or try providing a more specific part of the receipt for better recognition."
          }
        ></FormError>
      )}
      {noText && (
        <FormError
          message={
            "Please enter some text to analyze. If you have a receipt, copy and paste the items from the receipt."
          }
        ></FormError>
      )}

      {apiError && (
        <FormError
          message={"There was an error analyzing the text. Please try again."}
        ></FormError>
      )}
      {loading && <Loading loading={loading} />}
    </div>
  );
};

export default TextGpt;
