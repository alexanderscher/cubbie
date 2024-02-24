"use client";
import styles from "../upload.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import ImageGpt from "@/app/components/chatgpt/ImageGpt";
import ReceiptManual from "@/app/components/createForm/ReceiptManual";
import Preview from "@/app/components/createForm/Preview";
import OnlineReceiptManual from "@/app/components/createForm/OnlineReceiptManual";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES, ReceiptStoreStage } from "@/constants/form";
import FinalStage from "@/app/components/createForm/FinalStage";
import {
  GPT_IMAGE_SCHEMA,
  ITEMS_SCHEMA,
  RECEIPT_SCHEMA,
} from "@/utils/receiptValidation";
import Loading from "@/app/components/Loading";

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

const Memo = () => {
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

  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const submitDB = async (values: any) => {
    setLoading(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, memo: true }),
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
            submitDB(values);
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
              <div className="flex justify-between items-center">
                <h1 className="text-2xl text-emerald-900  ">Create New Memo</h1>

                <RegularButton
                  styles="bg border-emerald-900"
                  handleClick={() => router.push("/receipt-type")}
                >
                  <p className="text-emerald-900  text-sm">Discard</p>
                </RegularButton>
              </div>
              {(() => {
                switch (stage) {
                  case ReceiptStoreStage.IN_STORE_RECEIPT:
                    return (
                      <div className={`${styles.twoTab}`}>
                        <div className={`${styles.leftTab}`}>
                          <div className="flex justify-between">
                            <h1 className="text-orange-600 text-lg">Memo</h1>
                          </div>
                          <div className="flex justify-between w-full">
                            <RegularButton
                              styles={"bg-black text-white border-black"}
                            >
                              <p className="text-xs ">Add Memo Manually</p>
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
                              <p className="text-xs ">Analyze memo image</p>
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
                            errors={errors}
                          />

                          {/* <div className="flex gap-10">
                            <RegularButton
                              styles={
                                "bg-emerald-900 border-emerald-900 w-full"
                              }
                              handleClick={() => {
                                router.push("/receipt-type");
                              }}
                            >
                              <p className="text-white text-sm">Back</p>
                            </RegularButton>
                            <RegularButton
                              styles={
                                "bg-emerald-900 border-emerald-900 w-full"
                              }
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
                              <p className="text-white text-sm">Next</p>
                            </RegularButton>
                          </div> */}
                        </div>

                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                          stage={stage}
                        />
                      </div>
                    );

                  case ReceiptStoreStage.IN_STORE_ITEMS_MANUAL:
                    return (
                      <div className={`${styles.twoTab}`}>
                        <div className={`${styles.leftTab}`}>
                          <div className="flex justify-between">
                            <h1 className="text-orange-600 text-lg">
                              In Store Items
                            </h1>
                            {/* <RegularButton
                              styles={
                                "border-orange-600 text-orange-600 text-sm"
                              }
                            >
                              <p> {values.type}</p>
                            </RegularButton> */}
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
                              styles={
                                "bg-emerald-900 border-emerald-900 w-full"
                              }
                              handleClick={() => {
                                setStage(ReceiptStoreStage.IN_STORE_RECEIPT);
                              }}
                            >
                              <p className="text-white">Receipt</p>
                            </RegularButton>

                            <RegularButton
                              styles={
                                "bg-emerald-900 border-emerald-900 w-full"
                              }
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
                              <p className="text-white text-sm">Preview</p>
                            </RegularButton>
                          </div>
                        </div>
                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                          stage={stage}
                        />
                      </div>
                    );

                  case ReceiptStoreStage.IN_STORE_GPT:
                    return (
                      <div className={`${styles.twoTab}`}>
                        <div className={`${styles.leftTab}`}>
                          <div className="flex justify-between">
                            <h1 className="text-orange-600 text-lg">Memo</h1>
                            {/* <RegularButton
                              styles={
                                "border-orange-600 text-orange-600 text-sm"
                              }
                            >
                              <p> {values.type}</p>
                            </RegularButton> */}
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
                              <p className="text-xs ">Add Memo Manually</p>
                            </RegularButton>

                            <RegularButton
                              styles={"bg-black text-white border-black"}
                            >
                              <p className="text-xs ">Analyze memo image</p>
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
                              styles={
                                "bg-emerald-900 border-emerald-900 w-full"
                              }
                              handleClick={() => {
                                router.push("/receipt-type");
                              }}
                            >
                              <p className="text-white text-sm">Back</p>
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
                              <p className="text-white text-sm">Preview</p>
                            </RegularButton>
                          </div>
                        </div>

                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                          stage={stage}
                        />
                      </div>
                    );
                  case ReceiptStoreStage.PREVIEW:
                    return (
                      <FinalStage
                        values={values}
                        setStage={setStage}
                        setFieldValue={setFieldValue}
                        loading={loading}
                        uploadError={uploadError}
                        setUploadError={setUploadError}
                      />
                    );
                }
              })()}
            </form>
          )}
        </Formik>
      </div>
      {loading && <Loading loading={loading} />}
    </div>
  );
};

export default Memo;
