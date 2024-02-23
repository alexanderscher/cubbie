"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import styles from "@/app/receipt-type/upload.module.css";
import Image from "next/image";
import React, { ChangeEvent, useRef } from "react";
import CurrencyInput from "react-currency-input-field";

interface ReceiptManualProps {
  values: any;
  handleChange: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
  online?: boolean;
}

const ReceiptManual = ({
  values,
  handleChange,
  setFieldValue,
  errors,
  online = false,
}: ReceiptManualProps) => {
  const [help, setHelp] = React.useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = () => {
    if (fileInputRef.current !== null) {
      // Check if fileInputRef.current is not null
      fileInputRef.current.click(); // If not, it's safe to call click()
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.match("image.*")) {
        alert("Please upload an image file");

        return;
      }

      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFieldValue("receiptImage", reader.result);
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
    }
  };
  const handleCurrencyChangeAmount = (value: string | undefined) => {
    setFieldValue("amount", value || "");
  };

  const handleCurrencyChangeAsset = (value: string | undefined) => {
    setFieldValue("assetAmount", value || "");
  };

  return (
    <div className="flex flex-col gap-10 max-w-[1000px]">
      <div className="flex flex-col gap-2">
        <input
          className="w-full bg border-b-[1px] border-emerald-900  focus:outline-none focus:border-emerald-900 placeholder:text-3xl placeholder:text-orange-600 h-[50px] text-3xl text-orange-600"
          name="store"
          placeholder="Store Name*"
          value={values.store}
          onChange={handleChange("store")}
        />

        {errors.store && (
          <p className="text-orange-800 text-sm">{errors.store}</p>
        )}
      </div>

      <div className={styles.receiptContainer}>
        <div className={styles.receiptInputs}>
          <h1 className="text-emerald-900 text-xl">Receipt Details</h1>
          <div className="flex gap-2 w-full">
            <div className="w-1/2 ">
              <p className="text-sm text-slate-500 ">Amount*</p>
              <div className="flex flex-col gap-2">
                <CurrencyInput
                  id="amount"
                  name="amount"
                  className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900"
                  placeholder=""
                  defaultValue={values.amount || ""}
                  decimalsLimit={2}
                  onValueChange={handleCurrencyChangeAmount}
                />
                {errors.amount && (
                  <p className="text-orange-800 text-sm">{errors.amount}</p>
                )}
              </div>
            </div>
            <div className="w-1/2">
              <p className="text-sm text-slate-500 ">Asset Amount</p>
              {/* <button
                type="button"
                className="w-[20px] border-[1px] border-orange-600 text-orange-600 rounded-md text-xs"
                onClick={() => setHelp(!help)}
              >
                ?
              </button> */}

              <CurrencyInput
                id="assetAmount"
                name="assetAmount"
                className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900"
                placeholder=""
                defaultValue={values.assetAmount || ""}
                decimalsLimit={2}
                onValueChange={handleCurrencyChangeAsset}
              />
              {help && (
                <p className="text-xs text-center text-orange-600 mt-2">
                  Asset amount determines which item is considered an asset. An
                  asset is an item that is worth more than a certain amount.
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            <p className="text-sm text-slate-500 ">Card</p>
            <input
              className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900"
              name="card"
              value={values.card}
              onChange={handleChange("card")}
            />
          </div>

          {online && (
            <div className="w-full">
              <p className="text-sm text-slate-500 ">Tracking Number Link</p>
              <div className="flex flex-col gap-2">
                <input
                  className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900"
                  name="tracking_number"
                  value={values.tracking_number}
                  onChange={handleChange("tracking_number")}
                />
                {errors.tracking_number && (
                  <p className="text-orange-800 text-sm">
                    {errors.tracking_number}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 w-full">
            <div className="w-1/2">
              <p className="text-sm text-slate-500 ">Purchase Date</p>
              <div className="flex flex-col gap-2">
                <input
                  className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900"
                  name="purchase_date"
                  value={values.purchase_date}
                  onChange={handleChange("purchase_date")}
                  type="date"
                />
                {errors.purchase_date && (
                  <p className="text-orange-800 text-sm">
                    {errors.purchase_date}
                  </p>
                )}
              </div>
            </div>
            <div className="w-1/2">
              <p className="text-sm text-slate-500 ">Days until return</p>

              <input
                className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900 "
                value={values.days_until_return}
                onChange={(event) => {
                  const value = parseInt(event.target.value, 10);
                  setFieldValue("days_until_return", isNaN(value) ? "" : value);
                }}
              />
              {errors.days_until_return && (
                <p className="text-orange-800 text-sm">
                  {errors.days_until_return}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className={styles.imageInput}>
          <h1 className="text-emerald-900 text-xl">Receipt Image</h1>
          <div
            className={`${styles.imageSize} border-[1px] border-emerald-900 w-full h-full flex flex-col gap-3 justify-center items-center rounded-md`}
            onClick={handleContainerClick} // Add click handler to the container
            style={{ cursor: "pointer" }} // Make the cursor indicate a clickable area
          >
            <input
              type="file"
              onChange={handleFileChange}
              id="file-upload"
              style={{ opacity: 0, position: "absolute", zIndex: -1 }}
              ref={fileInputRef} // Attach the ref to the file input
            />
            <Image
              src="/image_b.png"
              alt=""
              width={40}
              height={40}
              className="object-cover pt-4"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <label
              htmlFor="file-upload"
              className="justify-center items-center"
            >
              Upload File
            </label>
          </div>
          <div className="relative w-24 h-24">
            {values.receiptImage && (
              <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-md">
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("receiptImage", "");
                  }}
                  className="absolute -top-2  -right-2 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                >
                  X
                </button>
                <Image
                  width={150}
                  height={150}
                  src={values.receiptImage}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptManual;
