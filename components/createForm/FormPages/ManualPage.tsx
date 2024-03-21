"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import ReceiptManual from "@/components/createForm/ReceiptManual";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES, ReceiptOnlineStage } from "@/constants/form";
import FinalStage from "@/components/createForm/FinalStage";
import { ITEMS_SCHEMA, RECEIPT_SCHEMA } from "@/utils/receiptValidation";
import Loading from "@/components/Loading";
import BottomBar from "@/components/createForm/BottomBar";
import ErrorModal from "@/components/error/Modal";
import { Pages } from "@/types/form";

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

const ManualPage = ({ projects }: Pages) => {
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
                          projects={projects}
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
                            <div className="flex gap-4 ">
                              <RegularButton
                                styles={"bg-emerald-900 border-emerald-900 "}
                                handleClick={async () => {
                                  console.log("values", values);
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
                                    setStage(ReceiptOnlineStage.PREVIEW);
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

export default ManualPage;
