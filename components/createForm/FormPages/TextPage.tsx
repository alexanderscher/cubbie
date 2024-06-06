"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import TextGpt from "@/components/chatgpt/TextGpt";
import ReceiptManual from "@/components/createForm/ReceiptManual";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES, ReceiptOnlineStage } from "@/constants/form";
import FinalStage from "@/components/createForm/FinalStage";
import { ITEMS_SCHEMA, RECEIPT_SCHEMA } from "@/utils/receiptValidation";
import Loading from "@/components/Loading/Loading";
import BottomBar from "@/components/createForm/BottomBar";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import ErrorModal from "@/components/modals/ErrorModal";
import { Pages } from "@/types/form";
import { toast } from "sonner";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { DiscardModal } from "@/components/modals/DiscardModal";

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

const TextPage = ({ projects, session }: Pages) => {
  const [stage, setStage] = useState<ReceiptOnlineStage>(
    ReceiptOnlineStage.ONLINE_RECEIPT
  );
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [errors, setErrors] = useState({
    store: "",
    folderName: "",
    amount: "",
    itemError: "",
    tracking_number: "",
    itemField: "",
    days_until_return: "",
    purchase_date: "",
  });
  const [discardModal, setDiscardModal] = useState(false);

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
      toast.success("Receipt uploaded successfully");
    } else {
      toast.error("An error occurred. Please try again.");
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
                          projects={projects}
                        />
                        <BottomBar>
                          <div className="flex justify-between w-full">
                            <RegularButton
                              styles="bg-white border-emerald-900"
                              handleClick={async () => {
                                setDiscardModal(true);
                              }}
                            >
                              <p className="text-emerald-900  text-xs">
                                Discard
                              </p>
                            </RegularButton>
                            <div className="flex gap-4 ">
                              <RegularButton
                                styles={"bg-emerald-900 border-emerald-900 "}
                                handleClick={async () => {
                                  const error = await validateForm();
                                  if (error) {
                                    console.log("error", error);
                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      store:
                                        error.store || prevErrors.store || "",

                                      folderName:
                                        error.folderName ||
                                        prevErrors.folderName ||
                                        "",

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
                                      folderName: "",
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
                    </div>
                  );
                case ReceiptOnlineStage.ONLINE_ITEMS:
                  return (
                    <div className="mt-10">
                      <div className="flex justify-center items-center w-full">
                        <div className="flex flex-col gap-6 max-w-[600px] w-full">
                          <div className="flex flex-col gap-6">
                            <h1 className="text-3xl text-orange-600">
                              Analyze Text
                            </h1>
                            <h1 className="text-emerald-900 text-xl ">
                              {values.store}
                            </h1>
                            <div className="flex  rounded text-xs border-[1px] border-emerald-900 p-4">
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

                          <TextGpt
                            setFieldValue={setFieldValue}
                            values={values}
                            setStage={setStage}
                            session={session}
                          />

                          <BottomBar>
                            <div className="flex justify-between w-full">
                              <RegularButton
                                styles="bg-white border-emerald-900"
                                handleClick={async () => {
                                  router.push("/");
                                }}
                              >
                                <p className="text-emerald-900  text-xs">
                                  Discard
                                </p>
                              </RegularButton>
                              <div className="flex gap-2 ">
                                <RegularButton
                                  styles={"border-emerald-900 w-full"}
                                  handleClick={() => {
                                    setStage(ReceiptOnlineStage.ONLINE_RECEIPT);
                                  }}
                                >
                                  <p className="text-emerald-900 text-xs">
                                    Back
                                  </p>
                                </RegularButton>

                                <RegularButton
                                  styles={
                                    "bg-emerald-900 border-emerald-900 w-full"
                                  }
                                  handleClick={async () => {
                                    setStage(ReceiptOnlineStage.PREVIEW);
                                  }}
                                >
                                  <p className="text-white text-xs">Finish</p>
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
      {discardModal && (
        <ModalOverlay onClose={() => setDiscardModal(false)}>
          <DiscardModal
            setDiscardModal={setDiscardModal}
            leavePage={() => router.push("/")}
          />
        </ModalOverlay>
      )}
      {loading && <Loading loading={loading} />}
    </div>
  );
};

export default TextPage;
