"use client";
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import RegularButton from "@/app/components/buttons/RegularButton";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { ChangeEvent, useState, FormEvent, use, useEffect } from "react";

interface Props {
  setFieldValue: any;
  values: any;
}

export default function ImageGpt({ setFieldValue, values }: Props) {
  const [image, setImage] = useState<string>("");

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

  const handleSubmit = async () => {
    // if (image === "") {
    //   alert("Upload an image.");
    //   return;
    // }

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
          <div>
            <div className="flex flex-col mb-6">
              {/* <UploadButton
                appearance={{
                  button:
                    "mt-3 ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed bg-green-900  after:bg-orange-00 w-full h-[100px]",
                }}
                endpoint="imageUploader"
                content={{}}
                onClientUploadComplete={(res) => {
                  handleFileChange;
                  if (values.receiptImage.length === 0) {
                    setFieldValue("receiptImage", res);
                  } else {
                    deleteUploadThingImage(values.receiptImage[0].key);
                    setFieldValue("receiptImage", res);
                  }
                }}
                onUploadError={(error: Error) => {}}
              /> */}
              <input
                type="file"
                className="text-sm border rounded-lg cursor-pointer"
                onChange={(e) => handleFileChange(e)}
              />
            </div>

            <div className="w-full">
              <RegularButton
                styles="border-green-900 w-full bg-green-900"
                type="submit"
                handleClick={handleSubmit}
              >
                <p className="text-white">Upload Image</p>
              </RegularButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
