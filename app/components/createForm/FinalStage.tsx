"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import { ReceiptOnlineStage, ReceiptStoreStage } from "@/constants/form";
import { ItemInput } from "@/types/form";
import { calculateReturnDate } from "@/utils/Date";
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 receipt-bar">
          <h1 className="text-orange-600 text-lg">{receiptInfo.store}</h1>

          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">NUMBER OF ITEMS</h1>
            <h1 className="">{receiptInfo.items.length}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">TOTAL AMOUNT</h1>
            <h1 className="">{formatCurrency(receiptInfo.amount)}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">CARD</h1>
            {receiptInfo.card ? receiptInfo.card : "None"}
          </div>
          {receiptInfo.type === "Online" && (
            <div className="receipt-info">
              <h1 className="text-slate-400  text-sm">TRACKING NUMBER</h1>
              <h1 className="">
                {receiptInfo.tracking_number
                  ? receiptInfo.tracking_number
                  : "None"}
              </h1>
            </div>
          )}

          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">PURCHASE DATE</h1>
            <h1 className=""> {receiptInfo.purchase_date}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">RETURN DATE</h1>

            {receiptInfo.purchase_date && receiptInfo.days_until_return && (
              <h1 className="">
                {calculateReturnDate(
                  receiptInfo.purchase_date,
                  receiptInfo.days_until_return
                )}
              </h1>
            )}
          </div>
        </div>
        {receiptInfo.receiptImage && (
          <div className="w-24 h-50 overflow-hidden relative flex items-center justify-center rounded-sm">
            <Image
              width={200}
              height={200}
              src={receiptInfo.receiptImage}
              alt=""
            />
          </div>
        )}
      </div>

      <div className="w-full gap-10  mb-[100px]">
        {receiptInfo.items.map((item: ItemInput, index: number) => (
          <div key={index} className="pt-5">
            <ReceiptFormItems
              stage="Final"
              item={item}
              values={receiptInfo}
              index={index}
              setFieldValue={setFieldValue}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
