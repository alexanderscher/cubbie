"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import ImageGpt from "@/app/components/chatgpt/ImageGpt";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES, ReceiptStoreStage } from "@/constants/form";
import FinalStage from "@/app/components/createForm/FinalStage";
import { GPT_IMAGE_SCHEMA, RECEIPT_SCHEMA } from "@/utils/receiptValidation";
import Loading from "@/app/components/Loading";
import BottomBar from "@/app/components/createForm/BottomBar";

const getValidationSchema = (stage: ReceiptStoreStage) => {
  switch (stage) {
    case ReceiptStoreStage.IN_STORE_RECEIPT:
      return RECEIPT_SCHEMA;

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
    folderName: "",
    memo: "",
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
              {(() => {
                switch (stage) {
                  case ReceiptStoreStage.IN_STORE_GPT:
                    return (
                      <div className="flex justify-center items-center w-full h-screen">
                        <div className="flex flex-col gap-6 max-w-[500px] w-full pb-[200px]">
                          <ImageGpt
                            handleChange={handleChange}
                            setFieldValue={setFieldValue}
                            values={values}
                            setStage={setStage}
                            errors={errors}
                            validateForm={validateForm}
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

      {loading && <Loading loading={loading} />}
    </div>
  );
};

export default Store;
