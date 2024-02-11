"use client";
import LargeButton from "@/app/components/buttons/LargeButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import { ReceiptInput } from "@/types/formTypes/form";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChangeEvent, useState, useCallback } from "react";

interface Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: ReceiptInput;
}

export default function ImageGpt({ setFieldValue, values }: Props) {
  const pathname = usePathname();
  const [image, setImage] = useState<string>("");
  const [noImage, setNoImage] = useState(false);
  const [help, setHelp] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noReceipt, setNoReceipt] = useState(false);
  const [invalidImage, setInvalidImage] = useState(false);
  const [apiError, setApiError] = useState(false);

  const OnlineGptCall = async () => {
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
      setApiError(true);
      setLoading(false);
      console.error("Failed to fetch data");

      return;
    }

    const data = await res.json();

    // if (data.choices[0].message.content === "This is not a receipt.") {
    //   setNoReceipt(true);
    //   setNoImage(false);
    //   setPrompt(false);
    //   setLoading(false);
    //   return;
    // }

    // const jsonObject = JSON.parse(data.choices[0].message.content);
    // setFieldValue("items", jsonObject.receipt.items);
    // setFieldValue("amount", jsonObject.receipt.total_amount);
    // setFieldValue("boughtDate", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);

    const jsonObject = JSON.parse(data);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("boughtDate", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);
    setFieldValue("receiptImage", image);

    const itemsWithAllProperties = jsonObject.receipt.items.map(
      (item: any) => ({
        description: item.description || "",
        photo: item.photo || "",
        price: item.price || 0,
        barcode: item.barcode || "",
        asset: item.hasOwnProperty("asset") ? item.asset : false,
        character: "",
      })
    );
    setFieldValue("items", itemsWithAllProperties);
    setNoImage(false);
    setPrompt(false);
    setLoading(false);
    setNoReceipt(false);
    setApiError(false);
  };

  const MemoGptCall = async () => {
    console.log("MemoGptCall");
    const res = await fetch("/api/gpt/analyze-memo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
      }),
    });

    if (!res.ok) {
      setApiError(true);
      setLoading(false);

      return;
    }

    const data = await res.json();

    // if (data.choices[0].message.content === "This is not a receipt.") {
    //   setNoreceipt(true);
    //   setNoImage(false);
    //   setPrompt(false);
    //   setLoading(false);
    //   return;
    // }

    // console.log(data.choices[0].message.content);

    // const jsonObject = JSON.parse(data.choices[0].message.content);
    // setFieldValue("items", jsonObject.receipt.items);
    // setFieldValue("amount", jsonObject.receipt.total_amount);
    // setFieldValue("boughtDate", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);

    const jsonObject = JSON.parse(data);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("boughtDate", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);
    setFieldValue("receiptImage", image);
    const itemsWithAllProperties = jsonObject.receipt.items.map(
      (item: any) => ({
        description: item.description || "",
        photo: item.photo || "",
        price: item.price || 0,
        barcode: item.barcode || "",
        product_id: item.product_id || "",
        asset: item.hasOwnProperty("asset") ? item.asset : false,
        character: "",
      })
    );
    setFieldValue("items", itemsWithAllProperties);

    setNoImage(false);
    setPrompt(false);
    setLoading(false);
    setNoReceipt(false);
    setApiError(false);
  };

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files === null || event.target.files.length === 0) {
        setNoImage(true);
        return;
      }

      const file = event.target.files[0];

      if (!file.type.match("image.*")) {
        setInvalidImage(true);
        return;
      }

      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
          setNoImage(false);
          setInvalidImage(false);
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
    },
    []
  );

  const handleSubmit = async () => {
    if (image === "") {
      setNoImage(true);
      return;
    }
    if (values.items.length > 0) {
      setPrompt(true);
    } else {
      setLoading(true);
      pathname === "/receipt-type/memo" ? MemoGptCall() : OnlineGptCall();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <button
          className="w-[20px] border-[1.5px] border-orange-600 text-orange-600 rounded-md"
          onClick={() => setHelp(!help)}
        >
          ?
        </button>
        {help && (
          <p className="text-sm text-center text-orange-600">
            We use OpenAI&apos;s GPT to analyze the image you upload. Take a
            picture of the receipt and upload it. Then click the &quot;Analyze
            Image&quot; button to get the receipt info and items.
          </p>
        )}

        <div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <input
                type="file"
                onChange={handleFileChange}
                id="file-upload-gpt"
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
              />
              <LargeButton height="h-[80px]">
                <label
                  htmlFor="file-upload-gpt"
                  className="w-full h-full flex justify-center items-center"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Upload File
                </label>
              </LargeButton>
            </div>
            {image !== "" && (
              <div className="w-[100px] h-[120px] overflow-hidden rounded-sm relative">
                <button
                  onClick={() => setImage("")}
                  type="button"
                  className="absolute top-0 right-0 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                >
                  X
                </button>
                <Image
                  src={image}
                  height={200}
                  width={200}
                  alt="Uploaded Image"
                  className="w-full object-contain"
                />
              </div>
            )}

            <div className="w-full">
              <RegularButton
                styles="border-emerald-900 bg w-full "
                type="submit"
                handleClick={() => {
                  !loading && handleSubmit();
                }}
              >
                <p className="text-emerald-900 ">
                  {" "}
                  {loading ? "Analyzing..." : "Analyze Image"}
                </p>
              </RegularButton>
            </div>
          </div>
        </div>
        {prompt && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-center text-black">
              Are you sure you want to anaylze? This will overwrite your current
              items
            </p>
            <div className="flex gap-2 justify-center items-center">
              <button
                onClick={() => {
                  pathname === "/receipt-type/memo"
                    ? MemoGptCall()
                    : OnlineGptCall();
                }}
              >
                <p className="text-sm text-orange-600">Confirm</p>
              </button>
              <button onClick={() => setPrompt(false)}>
                <p className="text-sm text-orange-600">Cancel</p>
              </button>
            </div>
          </div>
        )}
        {noReceipt && (
          <p className="text-sm text-center text-orange-800">
            The image you&apos;ve uploaded doesn&apos;t seem to be a receipt.
            Please ensure you upload a valid receipt, or try uploading a
            higher-quality image for better recognition.
          </p>
        )}
        {noImage && (
          <p className="text-sm text-center text-orange-800">
            Please upload an image to analyze. If you have a receipt, take a
            picture of the receipt and upload it.
          </p>
        )}
        {invalidImage && (
          <p className="text-sm text-center text-orange-800">
            Please upload a valid image file.
          </p>
        )}
        {apiError && (
          <p className="text-sm text-center text-orange-800">
            There was an error analyzing the image. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
