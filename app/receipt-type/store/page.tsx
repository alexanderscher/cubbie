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
import { ReceiptStoreStage } from "@/types/formTypes/form";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES } from "@/constants/form";
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import FinalStage from "@/app/components/createForm/FinalStage";

DEFAULT_INPUT_VALUES.type = "Store";

const Store = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [stage, setStage] = useState<ReceiptStoreStage>(
    ReceiptStoreStage.IN_STORE_RECEIPT
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
                  case ReceiptStoreStage.IN_STORE_RECEIPT:
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
                                  setStage(ReceiptStoreStage.PREVIEW);
                                }}
                              >
                                <p className="text-green-900 ">Preview</p>
                              </RegularButton>
                            ) : (
                              <RegularButton
                                submit
                                styles={"bg-orange-400 border-green-900 w-full"}
                                handleClick={() => {
                                  setStage(
                                    ReceiptStoreStage.IN_STORE_ITEMS_MANUAL
                                  );
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

                  case ReceiptStoreStage.IN_STORE_ITEMS_MANUAL:
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
                                setStage(ReceiptStoreStage.IN_STORE_RECEIPT);
                              }}
                            >
                              <p className="text-green-900 ">Back: Receipt</p>
                            </RegularButton>

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStoreStage.PREVIEW);
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
                  case ReceiptStoreStage.PREVIEW:
                    return (
                      <FinalStage
                        values={values}
                        setStage={setStage}
                        setFieldValue={setFieldValue}
                        handleSubmit={handleSubmit}
                      />
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
