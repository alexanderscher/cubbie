import { urlToBase64 } from "@/utils/urlToBase64";
import { useState } from "react";

const publicImageUrl = "/jeans.png";

const ImageUploader = () => {
  const handleSubmit = async () => {
    // Send the base64 image string to your API endpoint
    const dataUrl = await urlToBase64(publicImageUrl);
    const response = await fetch("/api/analyze-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: dataUrl }),
    });
    const data = await response.json();
    console.log(data.choices[0].message.content); // Process the response
  };

  return (
    <div>
      <button onClick={handleSubmit}>Analyze Public Image</button>
    </div>
  );
};

export default ImageUploader;
