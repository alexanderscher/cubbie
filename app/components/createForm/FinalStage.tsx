"use client";
import NonClickableButton from "@/app/components/buttons/NonClickableButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import { ReceiptOnlineStage, ReceiptStoreStage } from "@/constants/form";
import { ItemInput, ReceiptInput } from "@/types/form";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import styles from "./form.module.css";
import { useIsMobile } from "@/utils/useIsMobile";
import Image from "next/image";
import React from "react";
import ErrorModal from "@/app/components/error/Modal";

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
      {isMobile && (
        <div className=" flex flex-col gap-6 ">
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
      <ReceiptPageForm values={values} setFieldValue={setFieldValue} />

      {!isMobile && (
        <div className="fixed bottom-0 left-0 border-t-[1px] border-emerald-900 bg-green-50 w-full p-4 flex justify-between ">
          <div className="flex justify-between gap-3 ml-[140px]">
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
  return (
    <div className={`${styles.receipts}`}>
      <div className="flex flex-col gap-4 ">
        <div
          className={`flex flex-col gap-1 ${styles.receiptBar} border-t-[1px] border-black pt-3`}
        >
          <div className="flex justify-between w-full">
            <h1 className="text-orange-600 text-xl">{values.store}</h1>
            <div className="flex gap-2 items-start mt-2">
              {values.memo ? (
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
            <h1 className="text-slate-500  text-sm">Type</h1>
            {!values.memo &&
              (values.type == "Online" ? (
                <p className="text-sm ">{values.type}</p>
              ) : (
                <p className="text-sm ">In-{values.type}</p>
              ))}
          </div>

          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-500  text-sm">Number of Items</h1>
            <h1 className="">{values.items.length}</h1>
          </div>
          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-500  text-sm">Total Amount</h1>
            <h1 className="">{values.amount}</h1>
          </div>
          {values.card && (
            <div className="flex justify-between max-w-[500px]">
              <h1 className="text-slate-500  text-sm">Card</h1>
              {values.card}
            </div>
          )}

          {values.type === "Online" && (
            <div className="flex justify-between max-w-[500px]">
              <h1 className="text-slate-500  text-sm">Tracking Link</h1>
              <a className="" href={values.tracking_number} target="_blank">
                {values.tracking_number ? values.tracking_number : "None"}
              </a>
            </div>
          )}

          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-500  text-sm">Purchase Date</h1>
            <h1 className="">{formatDateToMMDDYY(values.purchase_date)}</h1>
          </div>
          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-500  text-sm">Return Date</h1>

            {values.purchase_date && values.days_until_return && (
              <h1 className="">
                {formatDateToMMDDYY(
                  calculateReturnDate(
                    values.purchase_date,
                    values.days_until_return
                  )
                )}
              </h1>
            )}
          </div>
        </div>
        <div className="w-full">
          {values.receiptImage && (
            <div
              className="w-full h-full overflow-hidden relative flex items-center justify-center rounded-sm "
              style={{ height: "300px" }}
            >
              <Image
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                src={values.receiptImage}
                alt=""
                className="absolute"
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full gap-10  mb-[100px] ">
        {values.items.map((item: ItemInput, index: number) => (
          <div key={index} className="pb-5">
            <ReceiptFormItems
              setFieldValue={setFieldValue}
              item={item}
              index={index}
              values={values}
              stage={"Final"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
