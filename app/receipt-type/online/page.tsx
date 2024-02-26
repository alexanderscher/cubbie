"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import TextGpt from "@/app/components/chatgpt/TextGpt";
import ReceiptManual from "@/app/components/createForm/ReceiptManual";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES, ReceiptOnlineStage } from "@/constants/form";
import FinalStage from "@/app/components/createForm/FinalStage";
import { ITEMS_SCHEMA, RECEIPT_SCHEMA } from "@/utils/receiptValidation";
import Loading from "@/app/components/Loading";
import BottomBar from "@/app/components/createForm/BottomBar";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import ErrorModal from "@/app/components/error/Modal";

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
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [errors, setErrors] = useState({
    store: "",
    amount: "",
    itemError: "",
    tracking_number: "",
    itemField: "",
    days_until_return: "",
    purchase_date: "",
  });

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

  const router = useRouter();

  return (
    <div className={"flex min-h-screen"}>
      <Formik
        initialValues={{
          ...DEFAULT_INPUT_VALUES,
          type: "Online",
        }}
        onSubmit={async (values) => {
          console.log("values", values);
          try {
            await ITEMS_SCHEMA.validate(values, { abortEarly: false });

            submitDB(values);
          } catch (error) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              itemError: "At least one item is required",
            }));
          }
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
          <form onSubmit={handleSubmit} className="w-full flex flex-col ">
            {(() => {
              switch (stage) {
                case ReceiptOnlineStage.ONLINE_RECEIPT:
                  return (
                    <div>
                      <div>
                        <ReceiptManual
                          online
                          setFieldValue={setFieldValue}
                          values={values}
                          handleChange={handleChange}
                          errors={errors}
                        />
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
                                    setStage(ReceiptOnlineStage.ONLINE_ITEMS);
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      store: "",
                                      amount: "",
                                      tracking_number: "",
                                    }));
                                  }
                                }}
                              >
                                <p className="text-white text-xs">Next</p>
                              </RegularButton>
                            </div>
                          </div>
                        </BottomBar>
                      </div>
                    </div>
                  );
                case ReceiptOnlineStage.ONLINE_ITEMS:
                  return (
                    <div>
                      <div className="flex justify-center items-center w-full">
                        <div className="flex flex-col gap-6 max-w-[600px] w-full">
                          <div className="flex flex-col gap-6">
                            <h1 className="text-2xl text-orange-600">
                              {values.store}
                            </h1>
                            <h1 className="text-emerald-900 text-xl ">
                              Receipt Items
                            </h1>
                            <div className="flex  rounded-lg text-xs border-[1px] border-emerald-900 p-4">
                              <div className="w-1/2 border-r-[1px] border-slate-300 pl-2 pr-2">
                                <p className="text-slate-400 text-xs">
                                  Purchase Date
                                </p>
                                <p>
                                  {formatDateToMMDDYY(values.purchase_date)}
                                </p>
                              </div>

                              <div className="pl-2 pr-2">
                                <p className="text-slate-400 text-xs">
                                  Return Date
                                </p>
                                <p>
                                  {formatDateToMMDDYY(
                                    calculateReturnDate(
                                      values.purchase_date,
                                      values.days_until_return
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between w-full">
                            <RegularButton
                              styles={`${
                                values.onlineType === "manual"
                                  ? "bg-black text-white"
                                  : "text-black"
                              } border-black`}
                              handleClick={() =>
                                setStage(ReceiptOnlineStage.PREVIEW)
                              }
                            >
                              <p className="text-xs ">Add Items Manually</p>
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
                              <p className="text-xs ">Analyze online receipt</p>
                            </RegularButton>
                          </div>
                          {errors.itemError && values.items.length === 0 && (
                            <p className=" text-orange-800 text-xs">
                              {errors.itemError}
                            </p>
                          )}
                          {errors.itemField && (
                            <p className=" text-orange-800 text-xs">
                              {errors.itemField}
                            </p>
                          )}
                          {values.onlineType === "gpt" && (
                            <TextGpt
                              setFieldValue={setFieldValue}
                              values={values}
                              setStage={setStage}
                            />
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
                              <div className="flex gap-3 ">
                                <RegularButton
                                  styles={
                                    "bg-emerald-900 border-emerald-900 w-full"
                                  }
                                  handleClick={() => {
                                    setStage(ReceiptOnlineStage.ONLINE_RECEIPT);
                                  }}
                                >
                                  <p className="text-white text-xs">Back</p>
                                </RegularButton>

                                <RegularButton
                                  styles={
                                    "bg-emerald-900 border-emerald-900 w-full"
                                  }
                                  handleClick={async () => {
                                    setStage(ReceiptOnlineStage.PREVIEW);
                                  }}
                                >
                                  <p className="text-white text-xs">Items</p>
                                </RegularButton>
                              </div>
                            </div>
                          </BottomBar>
                        </div>
                      </div>
                    </div>
                  );

                case ReceiptOnlineStage.PREVIEW:
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

export default Online;
