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
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import { ReceiptOnlineStage } from "@/types/formTypes/form";
import FinalStage from "@/app/components/createForm/FinalStage";
import * as Yup from "yup";

const onlineReceiptSchema = Yup.object({
  store: Yup.string().required("Store is required"),
  amount: Yup.number()
    .required("Amount is required")
    .typeError("Amount must be a number")
    .positive("Amount must be positive"),

  boughtDate: Yup.date().required("Bought date is required"),
  daysUntilReturn: Yup.number().required("Days until return is required"),
});

const getValidationSchema = (stage: ReceiptOnlineStage) => {
  switch (stage) {
    case ReceiptOnlineStage.ONLINE_RECEIPT:
      return onlineReceiptSchema;

    default:
      return undefined;
  }
};

const Online = () => {
  const [stage, setStage] = useState<ReceiptOnlineStage>(
    ReceiptOnlineStage.ONLINE_RECEIPT
  );
  const [errors, setErrors] = useState({});
  console.log(errors);
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
                  submit
                  styles="bg border-green-900"
                  handleClick={async () => {
                    if (values.receiptImage && values.receiptImage.length > 0) {
                      await deleteUploadThingImage(values.receiptImage[0].key);
                    }

                    if (values.items && values.items.length > 0) {
                      for (const item of values.items) {
                        if (item.photo && item.photo.length > 0) {
                          console.log("discard", item.photo[0].key);
                          await deleteUploadThingImage(item.photo[0].key);
                        }
                      }
                    }

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
                            <h1>Online Receipt</h1>
                            <RegularButton
                              styles={
                                "border-orange-400 text-orange-400 text-sm"
                              }
                            >
                              <p>{values.type}</p>
                            </RegularButton>
                          </div>
                          <ReceiptManual
                            setFieldValue={setFieldValue}
                            values={values}
                            handleChange={handleChange}
                            setStage={setStage}
                            errors={errors}
                          />
                          <div className="flex gap-2">
                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                router.push("/receipt-type");
                              }}
                            >
                              <p className="text-green-900 ">
                                Back: Receipt type
                              </p>
                            </RegularButton>

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={async () => {
                                const errors = await validateForm();
                                setErrors(errors);
                                if (Object.keys(errors).length === 0) {
                                  setStage(ReceiptOnlineStage.ONLINE_ITEMS);
                                }
                              }}
                            >
                              <p className="text-green-900 ">
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
                            <h1>Online Receipt Items</h1>
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
                          {values.onlineType === "gpt" ? (
                            <TextGpt
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          ) : (
                            <OnlineReceiptManual
                              validateForm={validateForm}
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          )}

                          <div className="flex gap-2 ">
                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptOnlineStage.ONLINE_RECEIPT);
                              }}
                            >
                              <p className="text-green-900 ">Back: Receipt</p>
                            </RegularButton>

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptOnlineStage.PREVIEW);
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
