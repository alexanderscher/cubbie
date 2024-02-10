"use client";

import RegularButton from "@/app/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import TextGpt from "@/app/components/chatgpt/TextGpt";
import ReceiptManual from "@/app/components/createForm/ReceiptManual";
import OnlineReceiptManual from "@/app/components/createForm/OnlineReceiptManual";
import Preview from "@/app/components/createForm/Preview";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES } from "@/constants/form";
import { ReceiptOnlineStage } from "@/types/formTypes/form";
import FinalStage from "@/app/components/createForm/FinalStage";
import { ITEMS_SCHEMA, RECEIPT_SCHEMA } from "@/utils/receiptValidation";

const getValidationSchema = (stage: ReceiptOnlineStage) => {
  switch (stage) {
    case ReceiptOnlineStage.ONLINE_RECEIPT:
      return RECEIPT_SCHEMA;
    case ReceiptOnlineStage.ONLINE_ITEMS:
      return ITEMS_SCHEMA;
    default:
      return;
  }
};

const Online = () => {
  const [stage, setStage] = useState<ReceiptOnlineStage>(
    ReceiptOnlineStage.ONLINE_RECEIPT
  );
  const [errors, setErrors] = useState({
    store: "",
    amount: "",
    itemError: "",
    trackingNumber: "",
    itemField: "",
  });

  const router = useRouter();

  return (
    <div className="flex ">
      <div className="w-full flex flex-col gap-8 ">
        <Formik
          initialValues={{
            ...DEFAULT_INPUT_VALUES,
            type: "Online",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
          validationSchema={getValidationSchema(stage)}
        >
          {({
            handleSubmit,
            setFieldValue,
            values,
            handleChange,
            validateForm,
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
                  styles="bg border-green-900"
                  handleClick={async () => {
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
                            <h1 className="text-orange-500 text-xl">
                              Online Receipt
                            </h1>
                            {/* <RegularButton
                              styles={"border-black text-black text-sm"}
                            >
                              <p>{values.type}</p>
                            </RegularButton> */}
                          </div>
                          <ReceiptManual
                            online
                            setFieldValue={setFieldValue}
                            values={values}
                            handleChange={handleChange}
                            errors={errors}
                          />
                          <div className="flex gap-2">
                            <RegularButton
                              styles={"bg-green-900 border-green-900 w-full"}
                              handleClick={() => {
                                router.push("/receipt-type");
                              }}
                            >
                              <p className="text-white text-sm">
                                Back: Receipt types
                              </p>
                            </RegularButton>

                            <RegularButton
                              styles={"bg-green-900 border-green-900 w-full"}
                              handleClick={async () => {
                                const error = await validateForm();
                                if (error) {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    store:
                                      error.store || prevErrors.store || "",
                                    amount:
                                      error.amount || prevErrors.amount || "",
                                    trackingNumber:
                                      error.trackingNumber ||
                                      prevErrors.trackingNumber ||
                                      "",
                                  }));
                                }
                                if (Object.keys(error).length === 0) {
                                  setStage(ReceiptOnlineStage.ONLINE_ITEMS);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    store: "",
                                    amount: "",
                                    trackingNumber: "",
                                  }));
                                }
                              }}
                            >
                              <p className="text-white text-sm">
                                Next: Receipt Items
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
                            <h1 className="text-orange-500 text-xl">
                              Online Receipt Items
                            </h1>
                            {/* <RegularButton
                              styles={"border-black text-black text-sm"}
                            >
                              <p> {values.type}</p>
                            </RegularButton> */}
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
                          {errors.itemError && values.items.length === 0 && (
                            <p className=" text-orange-800 text-sm">
                              {errors.itemError}
                            </p>
                          )}
                          {errors.itemField && (
                            <p className=" text-orange-800 text-sm">
                              {errors.itemField}
                            </p>
                          )}
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
                              styles={"bg-green-900 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptOnlineStage.ONLINE_RECEIPT);
                              }}
                            >
                              <p className="text-white text-sm">
                                Back: Receipt
                              </p>
                            </RegularButton>

                            <RegularButton
                              styles={"bg-green-900 border-green-900 w-full"}
                              handleClick={async () => {
                                const error = await validateForm();
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  itemError:
                                    typeof error.items === "string"
                                      ? error.items
                                      : prevErrors.itemError || "",
                                }));
                                for (const item of values.items) {
                                  if (
                                    item.description === "" ||
                                    item.price === ""
                                  ) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      itemField:
                                        "Decsription and price are required for each item.",
                                    }));
                                    return;
                                  }
                                }
                                if (
                                  Object.keys(error).length === 0 &&
                                  !errors.itemField
                                ) {
                                  setStage(ReceiptOnlineStage.PREVIEW);
                                }
                              }}
                            >
                              <p className="text-white text-sm">Preview</p>
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
