"use client";
import { convertStringToJson } from "@/utils/strToJson";
import { ChangeEvent, useState, FormEvent, use, useEffect } from "react";

export default function ImageUploader() {
  const [image, setImage] = useState<string>("");
  const [json, setJson] = useState([]);
  const [openAIResponse, setOpenAIResponse] = useState<string>();

  useEffect(() => {
    if (json.length > 0) {
      const response = json[0].message.content;
      const newJson = convertStringToJson(response);
      console.log(newJson);
    }
  }, [json]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files === null) {
      window.alert("No file selected. Choose a file.");
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        // console.log(reader.result);
        setImage(reader.result);
      }
    };

    reader.onerror = (error) => {
      console.log("error: " + error);
    };
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (image === "") {
      alert("Upload an image.");
      return;
    }

    const res = await fetch("/api/gpt/analyze-image", {
      // Ensure the path is correct based on your routing
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
      }),
    });

    if (!res.ok) {
      console.error("Failed to fetch data");
      // Handle error
      return;
    }

    const data = await res.json();
    console.log(data);
    setJson(data.choices);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-md">
      <div className="bg-slate-800 w-full max-w-2xl rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold mb-4">Uploaded Image</h2>
        {image !== "" ? (
          <div className="mb-4 overflow-hidden">
            <img src={image} className="w-full object-contain max-h-72" />
          </div>
        ) : (
          <div className="mb-4 p-8 text-center">
            <p>Once you upload an image, you will see it here.</p>
          </div>
        )}
        <div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col mb-6">
              <label className="mb-2 text-sm font-medium">Upload Image</label>
              <input
                type="file"
                className="text-sm border rounded-lg cursor-pointer"
                onChange={(e) => handleFileChange(e)}
              />
            </div>

            <div className="flex justify-center">
              <button type="submit" className="p-2 bg-sky-600 rounded-md mb-4">
                Ask ChatGPT To Analyze Your Image
              </button>
            </div>
          </form>
        </div>

        {openAIResponse !== "" ? (
          <div className="border-t border-gray-300 pt-4">
            <h2 className="text-xl font-bold mb-2">AI Response</h2>
            <p>{openAIResponse}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
