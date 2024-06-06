"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { Formik } from "formik";
import React, { useState } from "react";
import ImageGpt from "@/components/chatgpt/ImageGpt";
import { useRouter } from "next/navigation";
import { DEFAULT_INPUT_VALUES, ReceiptStoreStage } from "@/constants/form";
import FinalStage from "@/components/createForm/FinalStage";
import { GPT_IMAGE_SCHEMA } from "@/utils/receiptValidation";
import Loading from "@/components/Loading/Loading";
import BottomBar from "@/components/createForm/BottomBar";
import { Pages } from "@/types/form";
import { toast } from "sonner";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { DiscardModal } from "@/components/modals/DiscardModal";

const getValidationSchema = (stage: ReceiptStoreStage) => {
  switch (stage) {
    case ReceiptStoreStage.IN_STORE_GPT:
      return GPT_IMAGE_SCHEMA;
    default:
      return;
  }
};

const ImagePage = ({ projects, session }: Pages) => {
  const [stage, setStage] = useState<ReceiptStoreStage>(
    ReceiptStoreStage.IN_STORE_GPT
  );
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
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
    <div className="flex  mb-[200px]">
      <div className="w-full flex flex-col gap-8 ">
        <Formik
          initialValues={{
            ...DEFAULT_INPUT_VALUES,
            type: "Store",
          }}
          validationSchema={getValidationSchema(stage)}
          onSubmit={async (values) => {
            // console.log(values);
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
                            validateForm={validateForm}
                            projects={projects}
                            session={session}
                          />

                          <BottomBar>
                            <div className="flex justify-end w-full gap-2">
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

export default ImagePage;
