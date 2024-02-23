"use client";
import NonClickableButton from "@/app/components/buttons/NonClickableButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import { ReceiptOnlineStage, ReceiptStoreStage } from "@/constants/form";
import { ItemInput, ReceiptInput } from "@/types/form";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import styles from "./form.module.css";
import stylesReceipt from "@/app/receipt/receiptID.module.css";

import { useIsMobile } from "@/utils/useIsMobile";
import Image from "next/image";
import React, { useState } from "react";
import ErrorModal from "@/app/components/error/Modal";
import BottomBar from "@/app/components/createForm/BottomBar";
import { formatCurrency } from "@/utils/formatCurrency";
import ImageModal from "@/app/components/images/ImageModal";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import CurrencyInput from "react-currency-input-field";
import LargeButton from "@/app/components/buttons/LargeButton";

interface FinalStageProps {
  values: any;
  setStage: (stage: any) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  loading: boolean;
  uploadError: string;
  setUploadError: (value: string) => void;
}

const FinalStage = ({
  values,
  setStage,
  setFieldValue,
  loading,
  uploadError,
  setUploadError,
}: FinalStageProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-6">
      <ReceiptPageForm values={values} setFieldValue={setFieldValue} />

      <BottomBar>
        <div className="flex gap-2 ">
          <RegularButton
            styles={"border-emerald-900 "}
            handleClick={() => {
              if (values.type === "Online") {
                setStage(ReceiptOnlineStage.ONLINE_ITEMS);
              } else {
                setStage(ReceiptStoreStage.IN_STORE_GPT);
              }
            }}
          >
            <p className="text-emerald-900 text-sm">Back</p>
          </RegularButton>

          {loading ? (
            <RegularButton styles={"bg-emerald-900 border-emerald-900 "}>
              <p className="text-white text-sm">Uploading...</p>
            </RegularButton>
          ) : (
            <RegularButton
              type="submit"
              styles={"bg-emerald-900 border-emerald-900 "}
            >
              <p className="text-white text-sm">Submit</p>
            </RegularButton>
          )}
        </div>
      </BottomBar>

      {uploadError && (
        <ErrorModal
          errorMessage={uploadError}
          onClose={() => setUploadError("")}
        />
      )}
    </div>
  );
};

export default FinalStage;

interface ReceiptPageProps {
  values: ReceiptInput;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const ReceiptPageForm = ({ values, setFieldValue }: ReceiptPageProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-8  w-full h-full ">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl text-orange-600 w-3/4">{values.store}</h1>
      </div>
      <div className="flex border-[1px] border-emerald-900 rounded-lg text-sm  p-4">
        <div className="w-1/3 border-r-[1px] border-slate-300 ">
          <p className="text-slate-500 text-xs">Total amount</p>
          <p>{formatCurrency(values.amount)}</p>
        </div>
        <div className="w-1/3 border-r-[1px] border-slate-300 pl-2 pr-2">
          <p className="text-slate-500 text-xs">Purchase Date</p>
          <p>{formatDateToMMDDYY(values.purchase_date)}</p>
        </div>

        <div className="pl-2 pr-2">
          <p className="text-slate-500 text-xs">Return Date</p>
          <p>
            {formatDateToMMDDYY(
              calculateReturnDate(
                values.purchase_date,
                values.days_until_return
              )
            )}
          </p>
        </div>
      </div>
      <div className={`${stylesReceipt.receipt} `}>
        <div className={`${stylesReceipt.receiptLeft}  flex flex-col gap-2`}>
          <div
            className={`border-[1px] border-emerald-900 rounded-lg  flex flex-col gap-4 p-6`}
          >
            <p className="text-xl text-emerald-900">Receipt Information</p>
            {!values.receiptImage && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                <div className="w-full h-full flex justify-center items-start ">
                  <Image
                    src="/receipt_b.png"
                    alt=""
                    width={60}
                    height={60}
                    className="object-cover pt-4"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            )}

            {values.receiptImage && (
              <div className="w-full flex justify-center items-center  ">
                <div className=" w-[200px] max-h-[200px]  rounded-lg overflow-hidden">
                  <Image
                    src={values.receiptImage}
                    width={280}
                    height={280}
                    alt="Receipt Image"
                    className="object-contain rounded-lg cursor-pointer"
                    layout="intrinsic"
                    onClick={() => setIsOpen(true)}
                  />
                </div>
                <ImageModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  imageUrl={values.receiptImage ? values.receiptImage : ""}
                  altText="Your Image Description"
                />
              </div>
            )}

            <div className="flex flex-col gap-4 text-sm ">
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-500 text-xs">Quantity</p>
                <p className="">{values.items.length}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-500 text-xs">Receipt Type</p>
                <p className="">{values.type}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-500 text-xs">Card</p>
                <p className="">{values.card ? values.card : "None"}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-500 text-xs">Tracking Link</p>
                <p className="">
                  {values.tracking_number ? values.tracking_number : "None"}
                </p>
              </div>
              {/* <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-500 text-xs">Asset Amount</p>
                <p className="">
                  {values.asset_amount
                    ? formatCurrency(values.asset_amount)
                    : "None"}
                </p>
              </div> */}
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-2 pb-[200px] w-full`}>
          <div className={`${styles.boxes} `}>
            {values.items.length > 0 &&
              values.items.map((item: any, index: number) => (
                <ReceiptItems
                  key={item.id}
                  item={item}
                  index={index}
                  items={values.items}
                  setFieldValue={setFieldValue} // Pass setFieldValue to the child
                  asset_amount={parseInt(values.assetAmount)}
                />
                // <ReceiptFormItems
                //   key={item.id}
                //   item={item}
                //   index={index}
                //   setFieldValue={setFieldValue}
                //   values={values}
                // />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReceiptItemsProps {
  item: ItemInput;
  asset_amount: number;
  index: number;
  items: ItemInput[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}
type ItemInputKey = keyof ItemInput;

const ReceiptItems = ({
  item,
  asset_amount,
  index,
  items,
  setFieldValue,
}: ReceiptItemsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as ItemInputKey;
    if (!key) return;

    const updatedItems = [...items];
    updatedItems[index][key] = e.target.value;
    setFieldValue("items", updatedItems);
  };

  const handleCurrencyChange = (value: string | undefined) => {
    const updatedItems = [...items];
    updatedItems[index].price = value || "";
    setFieldValue("items", updatedItems);
  };

  return (
    <div className="border-t-[1px] border-black flex flex-col gap-4 w-full pt-5">
      <div className="w-full h-full flex gap-6">
        {/* <div className="w-[120px] h-[150px] flex items-center  flex-shrink-0 overflow-hidden rounded-lg ">
          <div className=" relative flex items-center justify-center ">
            <Image
              width={200}
              height={200}
              src={item.photo}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div> */}

        <div className="w-[120px] h-[150px] flex items-center  flex-shrink-0 overflow-hidden rounded-lg relative">
          <div className="flex flex-col h-full w-full">
            <input
              type="file"
              // onChange={(e) => {
              //   console.log("File input changed");
              //   if (e.target.files && e.target.files[0]) {
              //     const file = e.target.files[0];
              //     if (!file.type.match("image.*")) {
              //       alert("Please upload an image file");
              //       return;
              //     }

              //     if (!file.type.match("image.*")) {
              //       setInvalidImage(true);
              //       return;
              //     }

              //     const reader = new FileReader();
              //     reader.readAsDataURL(file);
              //     reader.onload = () => {
              //       if (typeof reader.result === "string") {
              //         setitem((prevState) => ({
              //           ...prevState,
              //           photo: reader.result as string,
              //         }));
              //         setInvalidImage(false);
              //       }
              //     };
              //     reader.onerror = (error) => {
              //       console.error("Error converting file to base64:", error);
              //     };
              //   }
              // }}
              id="file-upload-item"
              style={{ opacity: 0, position: "absolute", zIndex: -1 }}
            />
            <LargeButton height="h-full">
              <label
                htmlFor="file-upload-item"
                className="w-full h-full flex justify-center items-center"
                style={{
                  cursor: "pointer",
                }}
              >
                Upload File
              </label>
            </LargeButton>
          </div>
        </div>

        <div className="text-sm flex flex-col gap-3 items-start w-full ">
          <div className="w-full">
            <h1 className="text-slate-500 ">AMOUNT</h1>

            <CurrencyInput
              id="price"
              name="price"
              className="text-sm bg-white border-[1px] rounded-md p-2 bg border-slate-500 focus:outline-none w-full"
              placeholder=""
              value={item.price}
              defaultValue={item.price || ""}
              decimalsLimit={2}
              onValueChange={handleCurrencyChange}
            />

            {/* {errors.price && <p className="text-orange-900">{errors.price}</p>} */}
          </div>

          <div className="w-full">
            <h1 className="text-slate-500 ">CHARACTER</h1>

            <input
              className="  text-sm bg-white border-[1px] rounded-md p-2 bg border-slate-500 focus:outline-none w-full"
              name="character"
              value={item.character || ""}
              onChange={handleItemChange}
            />
          </div>
          <div className="w-full">
            <h1 className="text-slate-500 ">PRODUCT ID</h1>

            <input
              className="  text-sm bg-white border-[1px] rounded-md p-2 bg border-slate-500 focus:outline-none w-full"
              name="product_id"
              value={item.product_id}
              onChange={handleItemChange}
            />
          </div>
          <div className="w-full">
            <h1 className="text-slate-500 ">BARCODE</h1>

            <div className="flex flex-col gap-4">
              <input
                className="  text-sm bg-white border-[1px] rounded-md p-2 bg border-slate-500 focus:outline-none w-full"
                name="barcode"
                value={item.barcode}
                onChange={handleItemChange}
              />
              {/* <button
                  type="button"
                  className="border-[1px] border-emerald-900 p-3 rounded-lg   w-[150px]"
                  onClick={() => {
                    setShowScanner(true);
                  }}
                  disabled={showScanner}
                >
                  Scan barcode
                </button> */}

              {/* {showScanner && (
                  <div className="w-full">
                    <h1>Scan a Barcode</h1>
                    <BarcodeScanner
                      setShowScanner={setShowScanner}
                      onResult={(result) => {
                        handleBarcodeResult(result.text);

                        setShowScanner(false);
                      }}
                      onError={() => {
                        console.log("Error");
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowScanner(false);
                      }}
                    >
                      Close Scanner
                    </button>
                  </div>
                )} */}
            </div>
          </div>
          {/* {stage !== "Final" && (
            <div className="flex flex-col w-full max-w-[300px] gap-4">
              <div className="flex gap-4">
                {" "}
                <RegularButton
                  small
                  styles="bg border-black w-full"
                  handleClick={() => removeItem(index)}
                >
                  <p className="text-xs">Delete</p>
                </RegularButton>
                <RegularButton
                  small
                  styles="bg border-black w-full"
                  handleClick={toggleEdit}
                >
                  <p className="text-xs">{edit ? "Save" : "Edit"}</p>
                </RegularButton>
              </div>

              {edit && (
                <RegularButton
                  small
                  styles="bg border-black "
                  handleClick={handleCancel}
                >
                  <p className="text-xs">Cancel</p>
                </RegularButton>
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
