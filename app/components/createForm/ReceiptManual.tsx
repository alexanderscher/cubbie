import LargeButton from "@/app/components/buttons/LargeButton";
import { CURRENCY_MASK } from "@/constants/form";
import Image from "next/image";
import React, { ChangeEvent } from "react";
import MaskedInput from "react-text-mask";

const ReceiptManual = ({
  values,
  handleChange,
  setFieldValue,
  errors,
  online = false,
}: any) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const src = URL.createObjectURL(file);

      setFieldValue("receiptImage", src);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-green-900">Store</p>

          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            name="store"
            value={values.store}
            onChange={handleChange("store")}
          />
          {errors.store && (
            <p className="text-orange-800 text-xs">{errors.store}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-green-900">Amount</p>
          <MaskedInput
            mask={CURRENCY_MASK}
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            guide={false}
            value={values.amount}
            onChange={handleChange("amount")}
          />
          {errors.amount && (
            <p className="text-orange-800 text-xs">{errors.amount}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-green-900">Card</p>
          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            name="card"
            value={values.card}
            onChange={handleChange("card")}
          />
        </div>
        {online && (
          <div>
            <p className="text-sm text-green-900">Tracking Number Link</p>
            <input
              className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
              name="trackingNumber"
              value={values.trackingNumber}
              onChange={handleChange("trackingNumber")}
            />
            {errors.trackingNumber && (
              <p className="text-orange-800 text-xs">{errors.trackingNumber}</p>
            )}
          </div>
        )}

        <div>
          <p className="text-sm text-green-900">Purchase Date</p>

          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            name="boughtDate"
            value={values.boughtDate}
            onChange={handleChange("boughtDate")}
            type="date"
          />
          {errors.boughtDate && (
            <p className="text-orange-800 text-xs">{errors.boughtDate}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-green-900">Number of days until return</p>

          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            value={values.daysUntilReturn}
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              setFieldValue("daysUntilReturn", isNaN(value) ? "" : value);
            }}
          />
          {errors.daysUntilReturn && (
            <p className="text-orange-800 text-xs">{errors.daysUntilReturn}</p>
          )}
        </div>
        {values.type === "Store" && (
          <div>
            <p className="text-sm text-green-900">Image receipt</p>
            <div className="flex flex-col ">
              <input
                type="file"
                onChange={handleFileChange}
                id="file-upload-receipt"
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
              />
              <LargeButton height="h-[150px]">
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
      </div>
      <div>
        {values.receiptImage && (
          <div className="w-24 h-24 overflow-hidden relative flex items-center justify-center rounded-md">
            <button
              type="button"
              onClick={() => {
                setFieldValue("receiptImage", "");
              }}
              className="absolute top-0 right-0 m-1  bg-green-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
            >
              X
            </button>
            <Image width={150} height={150} src={values.receiptImage} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptManual;
