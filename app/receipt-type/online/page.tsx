"use client";

import RegularButton from "@/app/components/buttons/RegularButton";
import { useIsMobile } from "@/utils/useIsMobile";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TextGpt from "@/app/components/chatgpt/TextGpt";
import { calculateReturnDate } from "@/utils/calculateReturnDate";
import ReceiptManual from "@/app/components/createForm/ReceiptManual";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import OnlineReceiptManual from "@/app/components/createForm/OnlineReceiptManual";
import Preview from "@/app/components/createForm/Preview";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES } from "@/constants/form";
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import { ReceiptOnlineStage } from "@/types/formTypes/form";
import FinalStage from "@/app/components/createForm/FinalStage";

DEFAULT_INPUT_VALUES.type = "Online";

const Online = () => {
  const isMobile = useIsMobile();
  const [stage, setStage] = useState<ReceiptOnlineStage>(
    ReceiptOnlineStage.ONLINE_RECEIPT
  );
  const router = useRouter();

  return (
    <div className="flex ">
      <div className="w-full flex flex-col gap-8 ">
        <Formik
          initialValues={DEFAULT_INPUT_VALUES}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleSubmit, setFieldValue, values, handleChange }) => (
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
                  case ReceiptOnlineStage.ONLINE_RECEIPT:
                    return (
                      <div className="two-tab ">
                        <div className="left-tab">
                          <div className="flex justify-between">
                            <h1>Online Receipt</h1>
                            <RegularButton
                              styles={
                                "border-orange-400 text-orange-400 text-sm"
                              }
                            >
                              <p>{values.type}</p>
                            </RegularButton>
                          </div>
                          <ReceiptManual
                            setFieldValue={setFieldValue}
                            values={values}
                            handleChange={handleChange}
                            setStage={setStage}
                          />
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

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptOnlineStage.ONLINE_ITEMS);
                              }}
                            >
                              <p className="text-green-900 ">
                                Next: Receipt items
                              </p>
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
                  case ReceiptOnlineStage.ONLINE_ITEMS:
                    return (
                      <div className="two-tab ">
                        <div className="left-tab">
                          <div className="flex justify-between">
                            <h1>Online Receipt Items</h1>
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
                                values.onlineType === "manual"
                                  ? "bg-black text-white"
                                  : "text-black"
                              } border-black`}
                              handleClick={() =>
                                setFieldValue("onlineType", "manual")
                              }
                            >
                              <p className=" text-sm">Add Items Manually</p>
                            </RegularButton>

                            <RegularButton
                              styles={`${
                                values.onlineType === "gpt"
                                  ? "bg-black text-white"
                                  : "text-black"
                              } border-black`}
                              handleClick={() =>
                                setFieldValue("onlineType", "gpt")
                              }
                            >
                              <p className=" text-sm">Analyze online receipt</p>
                            </RegularButton>
                          </div>
                          {values.onlineType === "gpt" ? (
                            <TextGpt
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          ) : (
                            <OnlineReceiptManual
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          )}

                          <div className="flex gap-2 ">
                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptOnlineStage.ONLINE_RECEIPT);
                              }}
                            >
                              <p className="text-green-900 ">Back: Receipt</p>
                            </RegularButton>

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptOnlineStage.PREVIEW);
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

                  case ReceiptOnlineStage.PREVIEW:
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

export default Online;
