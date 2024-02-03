import React, { useEffect, useState } from "react";

interface Choices {
  message: {
    content: string;
  };
}

const TextGpt = () => {
  const [inputText, setInputText] = useState("");
  const [json, setJson] = useState<Choices[]>([]);

  useEffect(() => {
    if (json.length > 0) {
      const response = json[0].message.content;
      const newJson = JSON.parse(response);
      console.log(newJson);
    }
  }, [json]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const response = await fetch("/api/gpt/analyze-input", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json();
    setJson(data.choices);
  };
  return (
    <div>
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

export default TextGpt;
