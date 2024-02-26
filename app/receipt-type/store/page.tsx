"use client";
import styles from "../upload.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import ImageGpt from "@/app/components/chatgpt/ImageGpt";
import ReceiptManual from "@/app/components/createForm/ReceiptManual";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES, ReceiptStoreStage } from "@/constants/form";
import FinalStage from "@/app/components/createForm/FinalStage";
import {
  GPT_IMAGE_SCHEMA,
  ITEMS_SCHEMA,
  RECEIPT_SCHEMA,
} from "@/utils/receiptValidation";
import Loading from "@/app/components/Loading";
import BottomBar from "@/app/components/createForm/BottomBar";
import ErrorModal from "@/app/components/error/Modal";

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
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const submitDB = async (values: any) => {
    setLoading(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, memo: false }),
    });
    const data = await response.json();

    if (data.error) {
      setUploadError(data.error);
    } else {
      setUploadError("");
    }
    setLoading(false);
    if (response.ok) {
      router.push("/");
    }
  };

  const [errors, setErrors] = useState({
    store: "",
    amount: "",
    itemError: "",
    tracking_number: "",
    itemField: "",
    days_until_return: "",
    purchase_date: "",
    gptError: "",
    items: "",
    itemFileError: "",
  });

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
          onSubmit={async (values) => {
            try {
              await ITEMS_SCHEMA.validate(values, { abortEarly: false });

              submitDB(values);
            } catch (error) {
              console.log(error);
              setErrors((prevErrors) => ({
                ...prevErrors,
                itemError: "At least one item is required",
              }));
            }
          }}
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
              {(() => {
                switch (stage) {
                  case ReceiptStoreStage.IN_STORE_RECEIPT:
                    return (
                      <div>
                        <div className="">
                          <ReceiptManual
                            setFieldValue={setFieldValue}
                            values={values}
                            handleChange={handleChange}
                            errors={errors}
                            setStage={setStage}
                          />
                        </div>
                        <BottomBar>
                          <div className="flex justify-between w-full">
                            <RegularButton
                              styles="bg-white border-emerald-900"
                              handleClick={async () => {
                                router.push("/receipt-type");
                              }}
                            >
                              <p className="text-emerald-900  text-xs">
                                Discard
                              </p>
                            </RegularButton>
                            <div className="flex gap-3 ">
                              <RegularButton
                                styles={"bg-emerald-900 border-emerald-900 "}
                                handleClick={() => {
                                  router.push("/receipt-type");
                                }}
                              >
                                <p className="text-white text-xs">Back</p>
                              </RegularButton>
                              <RegularButton
                                styles={"bg-emerald-900 border-emerald-900 "}
                                handleClick={async () => {
                                  const error = await validateForm();
                                  if (error) {
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      store:
                                        error.store || prevErrors.store || "",

                                      tracking_number:
                                        error.tracking_number ||
                                        prevErrors.tracking_number ||
                                        "",
                                      days_until_return:
                                        error.days_until_return ||
                                        prevErrors.days_until_return ||
                                        "",
                                      purchase_date:
                                        error.purchase_date ||
                                        prevErrors.purchase_date ||
                                        "",
                                    }));
                                  }

                                  if (Object.keys(error).length === 0) {
                                    setStage(ReceiptStoreStage.PREVIEW);
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      store: "",
                                      amount: "",
                                      tracking_number: "",
                                    }));
                                  }
                                }}
                              >
                                <p className="text-white text-xs">Items</p>
                              </RegularButton>
                            </div>
                          </div>
                        </BottomBar>
                      </div>
                    );

                  case ReceiptStoreStage.IN_STORE_GPT:
                    return (
                      <div className="flex justify-center items-center w-full h-screen">
                        <div className="flex flex-col gap-6 max-w-[500px] w-full pb-[200px]">
                          <div className="flex justify-between">
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
                              <p className="text-xs ">Add Receipt Manually</p>
                            </RegularButton>

                            <RegularButton
                              styles={"bg-black text-white border-black"}
                            >
                              <p className="text-xs ">Analyze receipt image</p>
                            </RegularButton>
                          </div>

                          {errors.gptError && (
                            <p className=" text-orange-800 text-xs text-center">
                              {errors.gptError}
                            </p>
                          )}
                          {errors.itemField && (
                            <p className=" text-orange-800 text-xs text-center">
                              {errors.itemField}
                            </p>
                          )}

                          <ImageGpt
                            setFieldValue={setFieldValue}
                            values={values}
                            setStage={setStage}
                          />
                          {errors.items && (
                            <p className=" text-orange-800 text-xs text-center">
                              {errors.items}
                            </p>
                          )}

                          <BottomBar>
                            <div className="flex justify-between w-full">
                              <RegularButton
                                styles="bg-white border-emerald-900"
                                handleClick={async () => {
                                  router.push("/receipt-type");
                                }}
                              >
                                <p className="text-emerald-900  text-xs">
                                  Discard
                                </p>
                              </RegularButton>
                              <div className="flex gap-2 ">
                                <RegularButton
                                  styles={
                                    "bg-emerald-900 border-emerald-900 w-full"
                                  }
                                  handleClick={() => {
                                    router.push("/receipt-type");
                                  }}
                                >
                                  <p className="text-white text-xs">Back</p>
                                </RegularButton>
                                <RegularButton
                                  styles={
                                    "bg-emerald-900 border-emerald-900 w-full"
                                  }
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
                                  <p className="text-white text-xs">Items</p>
                                </RegularButton>
                              </div>
                            </div>
                          </BottomBar>
                        </div>
                      </div>
                    );
                  case ReceiptStoreStage.PREVIEW:
                    return (
                      <div className="flex justify-center items-center ">
                        <FinalStage
                          values={values}
                          setStage={setStage}
                          setFieldValue={setFieldValue}
                          loading={loading}
                          uploadError={uploadError}
                          setUploadError={setUploadError}
                        />
                      </div>
                    );
                }
              })()}
            </form>
          )}
        </Formik>
      </div>
      {errors.itemError && (
        <ErrorModal
          errorMessage={errors.itemError}
          onClose={() =>
            setErrors((prevErrors) => ({ ...prevErrors, itemError: "" }))
          }
        />
      )}

      {loading && <Loading loading={loading} />}
    </div>
  );
};

export default Store;
