"use client";
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import RegularButton from "@/app/components/buttons/RegularButton";
import { useUploadThing } from "@/utils/uploadthing";
import Image from "next/image";
import { ChangeEvent, useState, useCallback } from "react";

interface Props {
  setFieldValue: any;
  values: any;
}

export default function ImageGpt({ setFieldValue, values }: Props) {
  const [image, setImage] = useState<string>("");
  const [noImage, setNoImage] = useState(false);
  const [help, setHelp] = useState(false);

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (values.receiptImage.length === 0) {
        setFieldValue("receiptImage", res);
      } else {
        deleteUploadThingImage(values.receiptImage[0].key);
        setFieldValue("receiptImage", res);
      }
      alert("uploaded successfully!");
    },
    onUploadError: () => {},
    onUploadBegin: () => {},
  });

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files === null || event.target.files.length === 0) {
        setNoImage(true);
        window.alert("No file selected. Choose a file.");
        return;
      }

      const file = event.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
          startUpload([file]);
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
    },
    [startUpload]
  );

  const handleSubmit = async () => {
    if (image === "") {
      setNoImage(true);
      // return;
    }

    const res = await fetch("/api/gpt/analyze-image", {
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

      return;
    }

    const data = await res.json();

    // const jsonObject = JSON.parse(data.choices[0].message.content);
    // setFieldValue("items", jsonObject.receipt.items);
    // setFieldValue("amount", jsonObject.receipt.total_amount);
    // setFieldValue("boughtDate", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);

    const jsonObject = JSON.parse(data);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("boughtDate", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);
    setFieldValue("items", jsonObject.receipt.items);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <button
          className="w-[20px] border-[1.5px] border-orange-400 text-orange-400 rounded-md"
          onClick={() => setHelp(!help)}
        >
          ?
        </button>
        {help && (
          <p className="text-sm text-center text-orange-400">
            We use OpenAI&apos;s GPT to analyze the image you upload. Take a
            picture of the receipt and upload it. Then click the &quot;Analyze
            Image&quot; button to get the receipt info and items.
          </p>
        )}
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
          <div>
            <div className="flex flex-col mb-6">
              <input
                type="file"
                onChange={(e) => handleFileChange(e)}
                id="file-upload"
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
              />
              <RegularButton styles="border-green-900 w-full">
                <label
                  htmlFor="file-upload"
                  className="text-green-900 w-full"
                  style={{
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  Upload File
                </label>
              </RegularButton>
            </div>

            <div className="w-full">
              <RegularButton
                styles="border-green-900 w-full bg-green-900"
                type="submit"
                handleClick={handleSubmit}
              >
                <p className="text-white">Analyze Image</p>
              </RegularButton>
            </div>
          </div>
        </div>
        {noImage && (
          <p className="text-sm text-center text-red-500">
            Please upload an image to analyze. If you have a receipt, take a
            picture of the receipt and upload it.
          </p>
        )}
      </div>
    </div>
  );
}
