"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import styles from "@/app/receipt-type/upload.module.css";
import { ReceiptStoreStage } from "@/constants/form";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { ChangeEvent, use, useEffect, useRef } from "react";
import CurrencyInput from "react-currency-input-field";

interface ReceiptManualProps {
  values: any;
  handleChange: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
  online?: boolean;
  setStage?: (stage: ReceiptStoreStage) => void;
}

const ReceiptManual = ({
  values,
  handleChange,
  setFieldValue,
  errors,
  online = false,
  setStage,
}: ReceiptManualProps) => {
  const pathname = usePathname();
  const [help, setHelp] = React.useState(false);
  const [projects, setProjects] = React.useState([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
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

  const handleCurrencyChangeAsset = (value: string | undefined) => {
    setFieldValue("assetAmount", value || "");
  };

  useEffect(() => {
    const getProjects = async () => {
      const response = await fetch("/api/project");
      const data = await response.json();
      console.log(data);
      setProjects(data);
    };
    getProjects();
  }, []);
  console.log(values);

  return (
    <div className="flex flex-col gap-10  w-full justify-center items-center">
      <div className=" max-w-[600px] w-full">
        {pathname === "/receipt-type/store" && setStage && (
          <div className="w-full flex justify-between mb-8 gap-2">
            <RegularButton styles={"bg-black text-white border-black"}>
              <p className=" text-xs">Add Receipt Manually</p>
            </RegularButton>

            <RegularButton
              styles={"border-black"}
              handleClick={() => {
                setFieldValue("storeType", "gpt");
                setStage(ReceiptStoreStage.IN_STORE_GPT);
              }}
            >
              <p className=" text-xs">Analyze receipt image</p>
            </RegularButton>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            className="w-full bg border-b-[1px] border-emerald-900  focus:outline-none focus:border-emerald-900 placeholder:text-3xl placeholder:text-orange-600 h-[50px] text-2xl text-orange-600"
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
            <h1 className="text-emerald-900 text-xl mt-6">
              {pathname !== "/receipt-type/memo"
                ? "Receipt Details"
                : "Memo Details"}
            </h1>
            <div className="w-full">
              <p className="text-sm text-slate-400 ">Project folder</p>
              <select
                className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900"
                onChange={handleChange("folder")}
              >
                <option value="">Miscellaneous</option>
                {projects.map((project: any) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 w-full">
              <div className="w-full">
                <p className="text-sm text-slate-400 ">Asset Amount</p>

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
                    Asset amount determines which item is considered an asset.
                    An asset is an item that is worth more than a certain
                    amount.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm text-slate-400 ">Card</p>
              <input
                className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900"
                name="card"
                value={values.card}
                onChange={handleChange("card")}
              />
            </div>

            {online && (
              <div className="w-full">
                <p className="text-sm text-slate-400 ">Tracking Number Link</p>
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
                <p className="text-sm text-slate-400 ">Purchase Date</p>
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
                <p className="text-sm text-slate-400 ">Days until return</p>

                <input
                  className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900 "
                  value={values.days_until_return}
                  onChange={(event) => {
                    const value = parseInt(event.target.value, 10);
                    setFieldValue(
                      "days_until_return",
                      isNaN(value) ? "" : value
                    );
                  }}
                />
                {errors.days_until_return && (
                  <p className="text-orange-800 text-sm">
                    {errors.days_until_return}
                  </p>
                )}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Return Date</p>
              <div className="w-full border-[1px] bg border-emerald-900 p-2 rounded-md focus:outline-none focus:border-emerald-900 ">
                {formatDateToMMDDYY(
                  calculateReturnDate(
                    values.purchase_date,
                    values.days_until_return
                  )
                )}
              </div>
            </div>
          </div>

          <div className={`w-full relative`}>
            <div
              className={` border-[1px] border-emerald-900 w-full h-full flex flex-col gap-4 justify-center items-center rounded-md relative`}
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
                className="justify-center items-center"
              ></label>
            </div>
          </div>
          <div className="relative w-24 h-24 ">
            {values.receiptImage && (
              <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-md border-[1px] border-emerald-900">
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
