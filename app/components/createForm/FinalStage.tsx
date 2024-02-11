"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import {
  ItemInput,
  ReceiptOnlineStage,
  ReceiptStoreStage,
} from "@/types/formTypes/form";
import { calculateReturnDate } from "@/utils/calculateReturnDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { useIsMobile } from "@/utils/useIsMobile";
import Image from "next/image";
import React from "react";

interface FinalStageProps {
  values: any;
  setStage: (stage: any) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleSubmit: () => void;
}

const FinalStage = ({
  values,
  setStage,
  setFieldValue,
  handleSubmit,
}: FinalStageProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-6">
      <div className="receipts ">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 receipt-bar">
            <h1 className="text-orange-600 text-2xl">{values.store}</h1>

            <div className="receipt-info">
              <h1 className="text-slate-400  text-sm">NUMBER OF ITEMS</h1>
              <h1 className="">{values.items.length}</h1>
            </div>
            <div className="receipt-info">
              <h1 className="text-slate-400  text-sm">TOTAL AMOUNT</h1>
              <h1 className="">{formatCurrency(values.amount)}</h1>
            </div>
            <div className="receipt-info">
              <h1 className="text-slate-400  text-sm">CARD</h1>
              {values.card ? values.card : "None"}
            </div>
            {values.type === "Online" && (
              <div className="receipt-info">
                <h1 className="text-slate-400  text-sm">TRACKING NUMBER</h1>
                <h1 className="">
                  {values.trackingNumber ? values.trackingNumber : "None"}
                </h1>
              </div>
            )}

            <div className="receipt-info">
              <h1 className="text-slate-400  text-sm">PURCHASE DATE</h1>
              <h1 className=""> {values.boughtDate}</h1>
            </div>
            <div className="receipt-info">
              <h1 className="text-slate-400  text-sm">RETURN DATE</h1>

              {values.boughtDate && values.daysUntilReturn && (
                <h1 className="">
                  {calculateReturnDate(
                    values.boughtDate,
                    values.daysUntilReturn
                  )}
                </h1>
              )}
            </div>
          </div>
          {values.receiptImage && (
            <div className="w-24 h-50 overflow-hidden relative flex items-center justify-center rounded-sm">
              <Image
                width={200}
                height={200}
                src={values.receiptImage}
                alt=""
              />
            </div>
          )}
        </div>

        <div className="w-full gap-10  mb-[100px]">
          {values.items.map((item: ItemInput, index: number) => (
            <div key={index} className="pt-5">
              <ReceiptFormItems
                stage="Final"
                item={item}
                values={values}
                index={index}
                setFieldValue={setFieldValue}
              />
            </div>
          ))}
        </div>
      </div>
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
            styles={"bg-emerald-900 border-emerald-900 "}
            handleClick={() => handleSubmit()}
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
                if (values.type === "Store") {
                  values.storeType === "gpt"
                    ? setStage(ReceiptStoreStage.IN_STORE_GPT)
                    : setStage(ReceiptStoreStage.IN_STORE_RECEIPT);
                } else {
                  setStage(ReceiptStoreStage.IN_STORE_ITEMS_MANUAL);
                }
              }}
            >
              <p className="text-emerald-900  text-sm">Edit receipt</p>
            </RegularButton>
            {(values.storeType === "gpt" && values.type === "Online") ||
            (values.storeType !== "gpt" && values.type === "Store") ? (
              <RegularButton
                styles={"border-emerald-900 "}
                handleClick={() => {
                  if (values.type === "Online") {
                    setStage(ReceiptOnlineStage.ONLINE_ITEMS);
                  } else {
                    setStage(ReceiptStoreStage.IN_STORE_ITEMS_MANUAL);
                  }
                }}
              >
                <p className="text-emerald-900   text-sm">Edit receipt items</p>
              </RegularButton>
            ) : null}
          </div>
          <RegularButton
            type="submit"
            styles={"bg-emerald-900 border-emerald-900 "}
            handleClick={() => handleSubmit()}
          >
            <p className="text-white text-sm">Submit</p>
          </RegularButton>
        </div>
      )}
    </div>
  );
};

export default FinalStage;
