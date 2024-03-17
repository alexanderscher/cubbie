"use client";
import ProjectSelect from "@/app/components/createForm/ProjectSelect";
import { TooltipWithHelperIcon } from "@/app/components/tooltips/TooltipWithHelperIcon";
import styles from "@/app/create/upload.module.css";
import { getProjects } from "@/app/lib/projectsDB";
import { ReceiptStoreStage } from "@/constants/form";
import { Project } from "@/types/receiptTypes";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import { convertHeic } from "@/utils/media";
import Image from "next/image";
import React, { ChangeEvent, use, useEffect, useRef, useState } from "react";
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
  const [help, setHelp] = React.useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleContainerClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      if (!file.type.match("image.*")) {
        alert("Please upload an image file");

        return;
      }

      if (file.type === "image/heic" || file.name.endsWith(".heic")) {
        try {
          file = await convertHeic(file);
        } catch (error) {
          console.error("Error converting HEIC file:", error);
          alert("Error converting HEIC file.");
          return;
        }
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

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data as Project[]);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-10  w-full justify-center items-center">
      <div className=" max-w-[600px] w-full">
        <div className="flex flex-col gap-2">
          <input
            className="w-full bg border-b-[1px] border-slate-400 focus:border-emerald-900 focus:outline-none placeholder:text-3xl placeholder:text-orange-600 h-[50px] text-2xl text-orange-600"
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
            <ProjectSelect
              handleChange={handleChange}
              projects={projects}
              setFieldValue={setFieldValue}
              values={values}
              errors={errors}
            />
            <div className="flex gap-2 w-full">
              <div className="w-full">
                <div className="flex gap-2 mb-1">
                  <p className="text-sm text-slate-400 ">Asset Amount</p>
                  <TooltipWithHelperIcon
                    content="Asset amount determines which item is considered an asset.
                    An asset is an item that is worth more than a certain
                    amount."
                  />
                </div>

                <CurrencyInput
                  id="assetAmount"
                  name="assetAmount"
                  className="w-full border-[1px] bg  p-2 rounded-md border-slate-400 focus:border-emerald-900 focus:outline-none"
                  placeholder=""
                  defaultValue={values.assetAmount || ""}
                  decimalsLimit={2}
                  onValueChange={handleCurrencyChangeAsset}
                />
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm text-slate-400 ">Card</p>
              <input
                className="w-full border-[1px] bg  p-2 rounded-md border-slate-400 focus:border-emerald-900 focus:outline-none"
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
                    className="w-full border-[1px] bg  p-2 rounded-md border-slate-400 focus:border-emerald-900 focus:outline-none"
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
                    className="w-full border-[1px] bg  p-2 rounded-md border-slate-400 focus:border-emerald-900 focus:outline-none"
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
                  className="w-full border-[1px] bg  p-2 rounded-md border-slate-400 focus:border-emerald-900 focus:outline-none "
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
              <div className="w-full border-[1px] bg  p-2 rounded-md border-slate-400 focus:border-emerald-900 focus:outline-none ">
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
              className={` border-[1px]  w-full h-full flex flex-col gap-4 justify-center items-center rounded-md relative  border-slate-400`}
              onClick={handleContainerClick}
              style={{ cursor: "pointer" }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                id="file-upload"
                style={{
                  opacity: 0,
                  position: "absolute",
                  zIndex: -1,
                  width: "100%",
                  height: "100%",
                }}
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
          {values.receiptImage && (
            <div className="relative w-24 h-24 ">
              <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-md border-[1px] border-slate-400">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptManual;
