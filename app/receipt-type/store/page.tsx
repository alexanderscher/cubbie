"use client";

import RegularButton from "@/app/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import ImageGpt from "@/app/components/chatgpt/ImageGpt";
import ReceiptManual from "@/app/components/createForm/ReceiptManual";
import Preview from "@/app/components/createForm/Preview";
import OnlineReceiptManual from "@/app/components/createForm/OnlineReceiptManual";
import { ReceiptStoreStage } from "@/types/formTypes/form";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES } from "@/constants/form";
import FinalStage from "@/app/components/createForm/FinalStage";
import {
  GPT_IMAGE_SCHEMA,
  ITEMS_SCHEMA,
  RECEIPT_SCHEMA,
} from "@/utils/receiptValidation";

const getValidationSchema = (stage: ReceiptStoreStage) => {
  switch (stage) {
    case ReceiptStoreStage.IN_STORE_RECEIPT:
      return RECEIPT_SCHEMA;
    case ReceiptStoreStage.IN_STORE_ITEMS_MANUAL:
      return ITEMS_SCHEMA;
    case ReceiptStoreStage.IN_STORE_GPT:
      return GPT_IMAGE_SCHEMA;
    default:
      return;
  }
};

const Store = () => {
  const [stage, setStage] = useState<ReceiptStoreStage>(
    ReceiptStoreStage.IN_STORE_GPT
  );
  const [errors, setErrors] = useState({
    store: "",
    items: "",
    amount: "",
    gptError: "",
    itemFileError: "",
    itemField: "",
  });
  console.log(errors);
  const router = useRouter();

  return (
    <div className="flex ">
      <div className="w-full flex flex-col gap-8 ">
        <Formik
          initialValues={{
            ...DEFAULT_INPUT_VALUES,
            type: "Store",
          }}
          validationSchema={getValidationSchema(stage)}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({
            handleSubmit,
            setFieldValue,
            values,
            handleChange,
            validateForm,
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
                  styles="bg border-green-900"
                  handleClick={() => router.push("/receipt-type")}
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
                            <h1 className="">In Store Receipt</h1>
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
                              styles={"bg-black text-white border-black"}
                            >
                              <p className=" text-sm">Add Receipt Manually</p>
                            </RegularButton>

                            <RegularButton
                              styles={"border-black"}
                              handleClick={() => {
                                setFieldValue("storeType", "gpt");
                                setStage(ReceiptStoreStage.IN_STORE_GPT);
                                setErrors({
                                  ...errors,
                                  gptError: "",
                                  items: "",
                                  itemField: "",
                                  itemFileError: "",
                                });
                              }}
                            >
                              <p className=" text-sm">Analyze receipt image</p>
                            </RegularButton>
                          </div>
                          {errors.itemFileError && (
                            <p className=" text-orange-800 text-sm">
                              {errors.itemFileError}
                            </p>
                          )}
                          <ReceiptManual
                            setFieldValue={setFieldValue}
                            values={values}
                            handleChange={handleChange}
                            setStage={setStage}
                            errors={errors}
                          />

                          <div className="flex gap-10">
                            <RegularButton
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                router.push("/receipt-type");
                              }}
                            >
                              <p className="text-green-900 text-sm ">
                                Back: Receipt type
                              </p>
                            </RegularButton>
                            <RegularButton
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={async () => {
                                const error = await validateForm();
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  store: error.store || prevErrors.store || "",
                                  amount:
                                    error.amount || prevErrors.amount || "",
                                }));
                                if (Object.keys(error).length === 0) {
                                  setStage(
                                    ReceiptStoreStage.IN_STORE_ITEMS_MANUAL
                                  );
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    store: "",
                                    amount: "",
                                  }));
                                }
                              }}
                            >
                              <p className="text-green-900 text-sm ">
                                Next: Add items
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
                          {errors.items && (
                            <p className=" text-orange-800 text-sm">
                              {errors.items}
                            </p>
                          )}
                          {errors.itemField && (
                            <p className=" text-orange-800 text-sm">
                              {errors.itemField}
                            </p>
                          )}

                          {errors.itemFileError && (
                            <p className=" text-orange-800 text-sm">
                              {errors.itemFileError}
                            </p>
                          )}
                          <OnlineReceiptManual
                            setFieldValue={setFieldValue}
                            values={values}
                          />

                          <div className="flex gap-2 ">
                            <RegularButton
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStoreStage.IN_STORE_RECEIPT);
                              }}
                            >
                              <p className="text-green-900 ">Back: Receipt</p>
                            </RegularButton>

                            <RegularButton
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={async () => {
                                const error = await validateForm();

                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  items:
                                    typeof error.items === "string"
                                      ? error.items
                                      : prevErrors.items || "",
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
                                  setStage(ReceiptStoreStage.PREVIEW);
                                }
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

                  case ReceiptStoreStage.IN_STORE_GPT:
                    return (
                      <div className="two-tab ">
                        <div className="left-tab">
                          <div className="flex justify-between">
                            <h1 className="">In Store Receipt</h1>
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
                              styles={"border-black"}
                              handleClick={() => {
                                setFieldValue("storeType", "manual");
                                setErrors({
                                  ...errors,
                                  gptError: "",
                                  items: "",
                                  itemField: "",
                                  itemFileError: "",
                                });
                                setStage(ReceiptStoreStage.IN_STORE_RECEIPT);
                              }}
                            >
                              <p className=" text-sm">Add Receipt Manually</p>
                            </RegularButton>

                            <RegularButton
                              styles={"bg-black text-white border-black"}
                            >
                              <p className=" text-sm">Analyze receipt image</p>
                            </RegularButton>
                          </div>
                          {errors.gptError && (
                            <p className=" text-orange-800 text-sm text-center">
                              {errors.gptError}
                            </p>
                          )}
                          {errors.itemField && (
                            <p className=" text-orange-800 text-sm text-center">
                              {errors.itemField}
                            </p>
                          )}

                          <ImageGpt
                            setFieldValue={setFieldValue}
                            values={values}
                          />
                          {errors.items && (
                            <p className=" text-orange-800 text-sm text-center">
                              {errors.items}
                            </p>
                          )}

                          <div className="flex gap-10">
                            <RegularButton
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                router.push("/receipt-type");
                              }}
                            >
                              <p className="text-green-900 text-sm ">
                                Back: Receipt type
                              </p>
                            </RegularButton>
                            <RegularButton
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={async () => {
                                const error = await validateForm();
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  gptError:
                                    typeof error.items === "string"
                                      ? error.items
                                      : prevErrors.items || "",
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
                                  setStage(ReceiptStoreStage.PREVIEW);
                                }
                              }}
                            >
                              <p className="text-green-900 text-sm ">Preview</p>
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

// {
//   <div className="flex flex-col gap-4">
//     {" "}
//     {errors.gptError && (
//       <p className=" text-orange-800 text-sm text-center">{errors.gptError}</p>
//     )}
//     <div className="flex gap-10">
//       <RegularButton
//         styles={"bg-orange-400 border-green-900 w-full"}
//         handleClick={() => {
//           router.push("/receipt-type");
//         }}
//       >
//         <p className="text-green-900 text-sm ">Back: Receipt type</p>
//       </RegularButton>

//       <RegularButton
//         styles={"bg-orange-400 border-green-900 w-full"}
//         handleClick={() => {
//           validateSubmit(validateForm, values);
//         }}
//       >
//         <p className="text-green-900 text-sm ">Preview</p>
//       </RegularButton>
//     </div>
//   </div>;
// }
