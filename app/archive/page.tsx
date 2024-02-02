"use client";
import ImageUploader from "@/app/components/chatgpt/ImageUploader";
import React, { useEffect, useState } from "react";
import { convertStringToJson } from "@/utils/strToJson";

const Archive = () => {
  const [inputText, setInputText] = useState("");
  const [json, setJson] = useState([]);

  useEffect(() => {
    if (json.length > 0) {
      const response = json[0].message.content;
      const newJson = convertStringToJson(response);
      console.log(newJson);
    }
  }, [json]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/gpt/analyze-input", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json(); //
    // console.log(data);

    setJson(data.choices);
  };
  return (
    <div>
      <ImageUploader />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type something..."
        />
        <button type="submit">Analyze</button>
      </form>
    </div>
  );
};

export default Archive;
