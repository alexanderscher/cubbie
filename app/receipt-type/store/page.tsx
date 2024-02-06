"use client";

import RegularButton from "@/app/components/buttons/RegularButton";
import { useIsMobile } from "@/utils/useIsMobile";
import { Formik } from "formik";
import React, { useState } from "react";
import Image from "next/image";
import ImageGpt from "@/app/components/chatgpt/ImageGpt";
import { calculateReturnDate } from "@/utils/calculateReturnDate";
import ReceiptManual from "@/app/components/createForm/ReceiptManual";
import Preview from "@/app/components/createForm/Preview";
import OnlineReceiptManual from "@/app/components/createForm/OnlineReceiptManual";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import { ReceiptInput } from "@/types/formTypes/form";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES } from "@/constants/form";
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";

enum ReceiptStage {
  IN_STORE_RECEIPT = "IN_STORE_RECEIPT",
  IN_STORE_ITEMS_MANUAL = "IN_STORE_ITEMS",
  PREVIEW = "PREVIEW",
}

const Store = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [stage, setStage] = useState<ReceiptStage>(
    ReceiptStage.IN_STORE_RECEIPT
  );

  return (
    <div className="flex ">
      <div className="w-full flex flex-col gap-8 ">
        <Formik
          initialValues={DEFAULT_INPUT_VALUES}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({
            handleSubmit,
            setFieldValue,
            values,
            handleChange,
            resetForm,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-10 "
            >
              <div className="flex justify-between items-center">
                <h1 className="sm:text-3xl text-2xl text-green-900 ">
                  Create New Receipt
                </h1>

                <RegularButton
                  submit
                  styles="bg border-green-900"
                  handleClick={async () => {
                    if (values.receiptImage && values.receiptImage.length > 0) {
                      await deleteUploadThingImage(values.receiptImage[0].key);
                    }

                    if (values.items && values.items.length > 0) {
                      for (const item of values.items) {
                        if (item.photo && item.photo.length > 0) {
                          console.log("discard", item.photo[0].key);
                          await deleteUploadThingImage(item.photo[0].key);
                        }
                      }
                    }

                    router.push("/receipt-type");
                  }}
                >
                  <p className="text-green-900 text-sm">Discard</p>
                </RegularButton>
              </div>
              {(() => {
                switch (stage) {
                  case ReceiptStage.IN_STORE_RECEIPT:
                    return (
                      <div className="two-tab ">
                        <div className="left-tab">
                          <div className="flex justify-between">
                            <h1 className="text-lg ">In Store Receipt</h1>
                            <RegularButton
                              styles={
                                "border-orange-400 text-orange-400 text-sm"
                              }
                            >
                              <p> {values.type}</p>
                            </RegularButton>
                          </div>
                          <div className="w-full flex justify-between">
                            <RegularButton
                              styles={`${
                                values.storeType === "manual"
                                  ? "bg-black text-white"
                                  : "text-black"
                              } border-black`}
                              handleClick={() =>
                                setFieldValue("storeType", "manual")
                              }
                            >
                              <p className=" text-sm">Add Receipt Manually</p>
                            </RegularButton>

                            <RegularButton
                              styles={`${
                                values.storeType === "gpt"
                                  ? "bg-black text-white"
                                  : "text-black"
                              } border-black`}
                              handleClick={() =>
                                setFieldValue("storeType", "gpt")
                              }
                            >
                              <p className=" text-sm">Analyze receipt image</p>
                            </RegularButton>
                          </div>
                          {values.storeType === "gpt" ? (
                            <ImageGpt
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          ) : (
                            <ReceiptManual
                              setFieldValue={setFieldValue}
                              values={values}
                              handleChange={handleChange}
                              setStage={setStage}
                            />
                          )}

                          <div className="flex gap-2">
                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                router.push("/receipt-type");
                              }}
                            >
                              <p className="text-green-900 ">
                                Back: Receipt type
                              </p>
                            </RegularButton>
                            {values.storeType === "gpt" ? (
                              <RegularButton
                                submit
                                styles={"bg-orange-400 border-green-900 w-full"}
                                handleClick={() => {
                                  setStage(ReceiptStage.PREVIEW);
                                }}
                              >
                                <p className="text-green-900 ">Preview</p>
                              </RegularButton>
                            ) : (
                              <RegularButton
                                submit
                                styles={"bg-orange-400 border-green-900 w-full"}
                                handleClick={() => {
                                  setStage(ReceiptStage.IN_STORE_ITEMS_MANUAL);
                                }}
                              >
                                <p className="text-green-900 ">Add items</p>
                              </RegularButton>
                            )}
                          </div>
                        </div>

                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                          handleChange={handleChange}
                        />
                      </div>
                    );

                  case ReceiptStage.IN_STORE_ITEMS_MANUAL:
                    return (
                      <div className="two-tab ">
                        <div className="left-tab">
                          <div className="flex justify-between">
                            <h1>In Store Items</h1>
                            <RegularButton
                              styles={
                                "border-orange-400 text-orange-400 text-sm"
                              }
                            >
                              <p> {values.type}</p>
                            </RegularButton>
                          </div>

                          <OnlineReceiptManual
                            setFieldValue={setFieldValue}
                            values={values}
                          />

                          <div className="flex gap-2 ">
                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStage.IN_STORE_RECEIPT);
                              }}
                            >
                              <p className="text-green-900 ">Back: Receipt</p>
                            </RegularButton>

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStage.PREVIEW);
                              }}
                            >
                              <p className="text-green-900 ">Preview</p>
                            </RegularButton>
                          </div>
                        </div>
                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                          handleChange={handleChange}
                        />
                      </div>
                    );
                  case ReceiptStage.PREVIEW:
                    return (
                      <div className="flex flex-col gap-6">
                        <div className="receipts ">
                          <div className="flex flex-col gap-4">
                            <h1>Preview Receipt</h1>
                            <div className="flex flex-col gap-4 receipt-bar">
                              <h1 className="text-green-900 text-2xl ">
                                {values.store}
                              </h1>
                              {/* <RegularButton
                                styles={
                                  "border-orange-400 text-orange-400 text-sm"
                                }
                              >
                                <p> {values.type}</p>
                              </RegularButton> */}

                              <div className="receipt-info">
                                <h1 className="text-slate-500 font-bold text-sm">
                                  Number of items
                                </h1>
                                <h1 className="">{values.items.length}</h1>
                              </div>
                              <div className="receipt-info">
                                <h1 className="text-slate-500 font-bold text-sm">
                                  Total Amount
                                </h1>
                                <h1 className="">{values.amount}</h1>
                              </div>

                              <div className="receipt-info">
                                <h1 className="text-slate-500 font-bold text-sm">
                                  Date of purchase
                                </h1>
                                <h1 className=""> {values.boughtDate}</h1>
                              </div>
                              <div className="receipt-info">
                                <h1 className="text-slate-500 font-bold text-sm">
                                  Return Date
                                </h1>

                                {values.boughtDate &&
                                  values.daysUntilReturn && (
                                    <h1 className="text-green-900 text-sm">
                                      {calculateReturnDate(
                                        values.boughtDate,
                                        values.daysUntilReturn
                                      )}
                                    </h1>
                                  )}
                              </div>
                            </div>
                            {values.receiptImage &&
                              values.receiptImage.length > 0 && (
                                <div className="w-24 h-24 overflow-hidden relative flex items-center justify-center rounded-md">
                                  <Image
                                    width={200}
                                    height={200}
                                    src={values.receiptImage[0].url}
                                    alt=""
                                  />
                                </div>
                              )}
                          </div>

                          <div className="grid grid-cols-3 gap-10 receipt-grid mb-[100px]">
                            {values.items.map((item, index) => (
                              <div key={index}>
                                <ReceiptFormItems
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
                                styles={"bg-orange-400 border-green-900 w-full"}
                                submit
                                handleClick={() => {
                                  setStage(ReceiptStage.IN_STORE_RECEIPT);
                                }}
                              >
                                <p className="text-green-900 text-sm">
                                  Edit receipt
                                </p>
                              </RegularButton>
                              {values.type === "online" && (
                                <RegularButton
                                  styles={
                                    "bg-orange-400 border-green-900 w-full"
                                  }
                                  submit
                                  handleClick={() =>
                                    setStage(ReceiptStage.IN_STORE_ITEMS_MANUAL)
                                  }
                                >
                                  <p className="text-green-900  text-sm">
                                    Edit receipt items
                                  </p>
                                </RegularButton>
                              )}
                            </div>
                            <RegularButton
                              submit
                              styles={"bg-green-900 border-green-900 "}
                              handleClick={() => handleSubmit()}
                            >
                              <p className="text-white ">Submit</p>
                            </RegularButton>
                          </div>
                        )}
                        {!isMobile && (
                          <div className="fixed bottom-0 left-0 border-t-[1.5px] border-green-800 bg-white w-full p-4 flex justify-between">
                            <div className="flex justify-between gap-3">
                              <RegularButton
                                styles={"bg-orange-400 border-green-900 "}
                                handleClick={() => {
                                  setStage(ReceiptStage.IN_STORE_RECEIPT);
                                }}
                              >
                                <p className="text-green-900 text-sm">
                                  Edit receipt
                                </p>
                              </RegularButton>

                              <RegularButton
                                styles={"bg-orange-400 border-green-900 "}
                                handleClick={() =>
                                  setStage(ReceiptStage.IN_STORE_ITEMS_MANUAL)
                                }
                              >
                                <p className="text-green-900  text-sm">
                                  Edit receipt items
                                </p>
                              </RegularButton>
                            </div>
                            <RegularButton
                              styles={"bg-green-900 border-green-900 "}
                              handleClick={() => handleSubmit()}
                            >
                              <p className="text-white text-sm">Submit</p>
                            </RegularButton>
                          </div>
                        )}
                      </div>
                    );
                }
              })()}
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Store;
