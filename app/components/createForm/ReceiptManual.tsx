"use client";
import LargeButton from "@/app/components/buttons/LargeButton";
import Image from "next/image";
import React, { ChangeEvent } from "react";
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
    <div className="">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-emerald-900 ">Store</p>

          <input
            className="w-full bg border-[1.5px] border-emerald-900 p-2 rounded-lg focus:outline-none"
            name="store"
            value={values.store}
            onChange={handleChange("store")}
          />
          {errors.store && (
            <p className="text-orange-800 text-sm">{errors.store}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-emerald-900 ">Amount</p>
          <CurrencyInput
            id="amount"
            name="amount"
            className="w-full bg border-[1.5px] border-emerald-900 p-2 rounded-lg focus:outline-none"
            placeholder=""
            defaultValue={values.amount || ""}
            decimalsLimit={2}
            onValueChange={handleCurrencyChangeAmount}
          />
          {errors.amount && (
            <p className="text-orange-800 text-sm">{errors.amount}</p>
          )}
        </div>
        <div>
          <div className="flex gap-2 items-center mb-2">
            <p className="text-sm text-emerald-900 ">Asset Amount</p>
            <button
              className="w-[20px] border-[1.5px] border-orange-600 text-orange-600 rounded-lg text-xs"
              onClick={() => setHelp(!help)}
            >
              ?
            </button>
          </div>

          <CurrencyInput
            id="assetAmount"
            name="assetAmount"
            className="w-full bg border-[1.5px] border-emerald-900 p-2 rounded-lg focus:outline-none"
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

        <div>
          <p className="text-sm text-emerald-900 ">Card</p>
          <input
            className="w-full bg border-[1.5px] border-emerald-900 p-2 rounded-lg focus:outline-none"
            name="card"
            value={values.card}
            onChange={handleChange("card")}
          />
        </div>

        {online && (
          <div>
            <p className="text-sm text-emerald-900 ">Tracking Number Link</p>
            <input
              className="w-full bg border-[1.5px] border-emerald-900 p-2 rounded-lg focus:outline-none"
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
        )}

        <div>
          <p className="text-sm text-emerald-900 ">Purchase Date</p>

          <input
            className="w-full bg border-[1.5px] border-emerald-900 p-2 rounded-lg focus:outline-none"
            name="purchase_date"
            value={values.purchase_date}
            onChange={handleChange("purchase_date")}
            type="date"
          />
          {errors.purchase_date && (
            <p className="text-orange-800 text-sm">{errors.purchase_date}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-emerald-900 ">
            Number of days until return
          </p>

          <input
            className="w-full bg border-[1.5px] border-emerald-900 p-2 rounded-lg focus:outline-none"
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

        {values.type === "Store" && (
          <div>
            <p className="text-sm text-emerald-900 ">Image receipt</p>
            <div className="flex flex-col ">
              <input
                type="file"
                onChange={handleFileChange}
                id="file-upload-receipt"
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
              />
              <LargeButton height="h-[80px]">
                <label
                  className="w-full"
                  htmlFor="file-upload-receipt"
                  style={{
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  Upload File
                </label>
              </LargeButton>
            </div>
          </div>
        )}
        <div>
          {values.receiptImage && (
            <div className="w-24 h-24 overflow-hidden relative flex items-center justify-center rounded-sm">
              <button
                type="button"
                onClick={() => {
                  setFieldValue("receiptImage", "");
                }}
                className="absolute top-0 right-0 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
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
  );
};

export default ReceiptManual;
