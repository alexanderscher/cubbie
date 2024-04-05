"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import ImageGpt from "@/components/chatgpt/ImageGpt";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES, ReceiptStoreStage } from "@/constants/form";
import FinalStage from "@/components/createForm/FinalStage";
import { GPT_IMAGE_SCHEMA } from "@/utils/receiptValidation";
import Loading from "@/components/Loading";
import BottomBar from "@/components/createForm/BottomBar";
import { Pages } from "@/types/form";

const getValidationSchema = (stage: ReceiptStoreStage) => {
  switch (stage) {
    case ReceiptStoreStage.IN_STORE_GPT:
      return GPT_IMAGE_SCHEMA;
    default:
      return;
  }
};

const ImagePage = ({ projects }: Pages) => {
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
                      <div className="flex justify-center mt-[60px] w-full h-screen">
                        <div className="flex flex-col gap-6 max-w-[550px] w-full pb-[200px]">
                          <ImageGpt
                            handleChange={handleChange}
                            setFieldValue={setFieldValue}
                            values={values}
                            setStage={setStage}
                            errors={errors}
                            validateForm={validateForm}
                            projects={projects}
                          />

                          <BottomBar>
                            <div className="flex justify-end w-full gap-2">
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
                              {values.folderName && (
                                <RegularButton
                                  styles="bg-white border-emerald-900"
                                  handleClick={async () => {
                                    setStage(ReceiptStoreStage.PREVIEW);
                                  }}
                                >
                                  <p className="text-emerald-900  text-xs">
                                    Items
                                  </p>
                                </RegularButton>
                              )}
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

export default ImagePage;
