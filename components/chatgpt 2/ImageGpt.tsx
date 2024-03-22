"use client";
import LargeButton from "@/app/components/buttons/LargeButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import { ReceiptStoreStage } from "@/constants/form";
import { ReceiptInput } from "@/types/form";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChangeEvent, useState, useCallback, useRef } from "react";

interface Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: ReceiptInput;
  setStage: (stage: any) => void;
}

export default function ImageGpt({ setFieldValue, values, setStage }: Props) {
  const pathname = usePathname();
  const [image, setImage] = useState<string>("");
  const [noImage, setNoImage] = useState(false);
  const [help, setHelp] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noReceipt, setNoReceipt] = useState(false);
  const [invalidImage, setInvalidImage] = useState(false);
  const [apiError, setApiError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  };

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
    // setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);

    const jsonObject = JSON.parse(data);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);
    setFieldValue("receiptImage", image);

    const itemsWithAllProperties = jsonObject.receipt.items.map(
      (item: any) => ({
        description: item.description || "",
        photo: item.photo || "",
        price: item.price || 0,
        barcode: item.barcode || "",
        character: "",
      })
    );
    setFieldValue("items", itemsWithAllProperties);
    setStage(ReceiptStoreStage.PREVIEW);
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
    // setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);

    const jsonObject = JSON.parse(data);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);
    setFieldValue("receiptImage", image);
    const itemsWithAllProperties = jsonObject.receipt.items.map(
      (item: any) => ({
        description: item.description || "",
        photo: item.photo || "",
        price: item.price || 0,
        barcode: item.barcode || "",
        product_id: item.product_id || "",
        character: "",
      })
    );
    setFieldValue("items", itemsWithAllProperties);
    setStage(ReceiptStoreStage.PREVIEW);

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
          setFieldValue("receiptImage", reader.result);
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
    },
    [setFieldValue]
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

  const handleCurrencyChangeAsset = (value: string | undefined) => {
    setFieldValue("assetAmount", value || "");
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="w-[20px] border-[1px] border-orange-600 text-orange-600 rounded-md text-sm"
          onClick={() => setHelp(!help)}
        >
          ?
        </button>
        {help && (
          <p className="text-sm text-center text-orange-600">
            We use AI to analyze the receipt image you upload. Take a picture of
            the receipt and upload it. Then click the &quot;Analyze Image&quot;
            button to get the receipt information and items. Please only upload
            images of receipts.
          </p>
        )}

        <div>
          <div className="flex flex-col gap-5">
            <div
              className={` border-[1px] border-emerald-900 w-full flex flex-col gap-4 justify-center items-center rounded-md relative h-[200px] `}
              onClick={handleContainerClick}
              style={{ cursor: "pointer" }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                id="file-upload"
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                ref={fileInputRef}
              />
              <Image
                src="/image_b.png"
                alt=""
                width={30}
                height={30}
                className="object-cover pt-4"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <label
                htmlFor="file-upload"
                className="justify-center items-center cursor-pointer text-sm"
              >
                Upload file
              </label>
            </div>
            {/* <div className="flex flex-col">
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
            </div> */}

            {image !== "" && (
              <div className="relative w-24 h-24 ">
                <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-md border-[1px] border-emerald-900">
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute -top-2  -right-2 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                  >
                    X
                  </button>
                  <Image width={150} height={150} src={image} alt="" />
                </div>
              </div>
            )}

            <div className="w-full">
              <RegularButton
                styles="border-emerald-900 bg w-full "
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
          <div className="flex flex-col gap-4 mt-10">
            <p className="text-sm text-center text-black">
              Are you sure you want to anaylze? This will overwrite your current
              items
            </p>
            <div className="flex gap-2">
              <RegularButton
                styles={"bg border-black w-full"}
                handleClick={() => {
                  pathname === "/receipt-type/memo"
                    ? MemoGptCall()
                    : OnlineGptCall();
                }}
              >
                <p className="text-sm">Confirm</p>
              </RegularButton>
              <RegularButton
                styles={"bg border-black w-full"}
                handleClick={() => setPrompt(false)}
              >
                <p className="text-sm">Cancel</p>
              </RegularButton>
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
