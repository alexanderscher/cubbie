import RegularButton from "@/app/components/buttons/RegularButton";
import React, { useEffect, useState } from "react";

interface Props {
  setFieldValue: any;
}

const TextGpt = ({ setFieldValue }: Props) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = async () => {
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
    <div>
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
    </div>
  );
};

export default TextGpt;
