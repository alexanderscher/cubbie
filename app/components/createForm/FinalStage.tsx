"use client";
import NonClickableButton from "@/app/components/buttons/NonClickableButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import { ReceiptOnlineStage, ReceiptStoreStage } from "@/constants/form";
import { ItemInput } from "@/types/form";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";

import { useIsMobile } from "@/utils/useIsMobile";
import Image from "next/image";
import React from "react";

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
      <ReceiptPageForm receiptInfo={values} setFieldValue={setFieldValue} />

      {isMobile && (
        <div className=" flex flex-col gap-6 pb-[200px]">
          <div className="flex justify-between gap-3">
            <RegularButton
              styles={" border-emerald-900 w-full"}
              handleClick={() => {
                {
                  values.type === "Online"
                    ? setStage(ReceiptOnlineStage.ONLINE_RECEIPT)
                    : setStage(ReceiptStoreStage.IN_STORE_RECEIPT);
                }
              }}
            >
              <p className="text-emerald-900  text-sm">Edit receipt</p>
            </RegularButton>

            <RegularButton
              styles={" border-emerald-900 w-full"}
              handleClick={() => {
                values.type === "Online"
                  ? setStage(ReceiptOnlineStage.ONLINE_ITEMS)
                  : setStage(ReceiptStoreStage.IN_STORE_ITEMS_MANUAL);
              }}
            >
              <p className="text-emerald-900   text-sm">Edit receipt items</p>
            </RegularButton>
          </div>
          <RegularButton
            type="submit"
            styles={"bg-emerald-900 border-emerald-900 "}
          >
            <p className="text-white ">Submit</p>
          </RegularButton>
        </div>
      )}
      {!isMobile && (
        <div className="fixed bottom-0 left-0 border-t-[1.5px] border-emerald-900 bg-green-50 w-full p-4 flex justify-between">
          <div className="flex justify-between gap-3">
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
              <p className="text-emerald-900   text-sm">Edit receipt</p>
            </RegularButton>
          </div>
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
      )}
      {uploadError && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="p-8 z-50 max-w-[700px] w-3/4 bg-white h-[200px] rounded-md border-black border-[2px] shadow-lg">
            <div className="flex flex-col justify-between h-full">
              <p className="">
                <span className="text-orange-900">Error: </span>
                {uploadError}
              </p>

              <button
                type="submit"
                className="text-end "
                onClick={() => setUploadError("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalStage;

interface ReceiptPageProps {
  receiptInfo: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const ReceiptPageForm = ({ receiptInfo, setFieldValue }: ReceiptPageProps) => {
  return (
    <div className="receipts ">
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-1 receipt-bar border-t-[1.5px] border-black pt-3">
          <div className="flex justify-between w-full">
            <h1 className="text-orange-600 text-xl">{receiptInfo.store}</h1>
            <div className="flex gap-2 items-start mt-2">
              {receiptInfo.memo ? (
                <NonClickableButton small styles="bg border-black">
                  <p className="text-xs text-black">Memo</p>
                </NonClickableButton>
              ) : (
                <NonClickableButton small styles="bg-black border-black">
                  <p className="text-xs text-white">Receipt</p>
                </NonClickableButton>
              )}
            </div>
          </div>

          <h1 className="mt-4">Details</h1>

          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Type</h1>
            {!receiptInfo.memo &&
              (receiptInfo.type == "Online" ? (
                <p className="text-sm ">{receiptInfo.type}</p>
              ) : (
                <p className="text-sm ">In-{receiptInfo.type}</p>
              ))}
          </div>

          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Number of Items</h1>
            <h1 className="">{receiptInfo.items.length}</h1>
          </div>
          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Total Amount</h1>
            <h1 className="">{receiptInfo.amount}</h1>
          </div>
          {receiptInfo.card && (
            <div className="flex justify-between max-w-[500px]">
              <h1 className="text-slate-400  text-sm">Card</h1>
              {receiptInfo.card}
            </div>
          )}

          {receiptInfo.type === "Online" && (
            <div className="flex justify-between max-w-[500px]">
              <h1 className="text-slate-400  text-sm">Tracking Link</h1>
              <a
                className=""
                href={receiptInfo.tracking_number}
                target="_blank"
              >
                {receiptInfo.tracking_number
                  ? receiptInfo.tracking_number
                  : "None"}
              </a>
            </div>
          )}

          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Purchase Date</h1>
            <h1 className="">
              {formatDateToMMDDYY(receiptInfo.purchase_date)}
            </h1>
          </div>
          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Return Date</h1>

            {receiptInfo.purchase_date && receiptInfo.days_until_return && (
              <h1 className="">
                {formatDateToMMDDYY(
                  calculateReturnDate(
                    receiptInfo.purchase_date,
                    receiptInfo.days_until_return
                  )
                )}
              </h1>
            )}
          </div>
        </div>
        <div className="w-full">
          {receiptInfo.receipt_image_url && (
            <div
              className="w-full h-full overflow-hidden relative flex items-center justify-center rounded-sm "
              style={{ height: "300px" }}
            >
              <Image
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                src={receiptInfo.receipt_image_url}
                alt=""
                className="absolute"
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full gap-10  mb-[100px] ">
        {receiptInfo.items.map((item: ItemInput, index: number) => (
          <div key={index} className="pb-5">
            <ReceiptFormItems
              setFieldValue={setFieldValue}
              item={item}
              index={index}
              values={receiptInfo}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
