"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { convertStringToJson } from "@/utils/strToJson";
import Image from "next/image";
import { ChangeEvent, useState, FormEvent, use, useEffect } from "react";

interface Choices {
  message: {
    content: string;
  };
}

export default function ImageUploader() {
  const [image, setImage] = useState<string>("");
  const [json, setJson] = useState<Choices[]>([]);

  const [openAIResponse, setOpenAIResponse] = useState<string>();

  useEffect(() => {
    if (json.length > 0) {
      console.log(json);
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
    <div>
      <div>
        <h2 className="text-xl font-bold mb-4">Upload Image of receipt</h2>
        {image !== "" && (
          <div className="mb-4 overflow-hidden">
            <Image
              src={image}
              height={300}
              width={300}
              alt="Uploaded Image"
              className="w-full object-contain max-h-72"
            />
          </div>
        )}
        <div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col mb-6">
              <input
                type="file"
                className="text-sm border rounded-lg cursor-pointer"
                onChange={(e) => handleFileChange(e)}
              />
            </div>

            <div className="flex justify-center">
              <RegularButton styles="" type="submit">
                Analzye Receipt
              </RegularButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
