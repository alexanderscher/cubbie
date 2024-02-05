import RegularButton from "@/app/components/buttons/RegularButton";
import React, { useEffect, useState } from "react";

interface Props {
  setFieldValue: any;
}

const TextGpt = ({ setFieldValue }: Props) => {
  const [inputText, setInputText] = useState("");
  const [noText, setNoText] = useState(false);
  const [help, setHelp] = useState(false);

  const handleSubmit = async () => {
    if (inputText === "") {
      setNoText(true);
    }

    const response = await fetch("/api/gpt/analyze-input", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json();
    console.log(data);
    setFieldValue("items", data);

    // const items = JSON.parse(data.choices[0].message.content);
    // setFieldValue("items", items.items);
    // console.log(items.items);
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
        styles={"bg-green-900 border-green-900 w-full"}
        handleClick={handleSubmit}
      >
        <p className="text-white ">Analyze</p>
      </RegularButton>
      {noText && (
        <p className="text-sm text-center text-red-500">
          Please enter some text to analyze. If you have a receipt, copy and
          paste the items from the receipt.
        </p>
      )}
    </div>
  );
};

export default TextGpt;
