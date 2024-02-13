"use client";
import LargeButton from "@/app/components/buttons/LargeButton";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import {
  ReceiptInput,
  ReceiptOnlineStage,
  ReceiptStoreStage,
} from "@/types/formTypes/form";
import { calculateReturnDate } from "@/utils/calculateReturnDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { RECEIPT_SCHEMA } from "@/utils/receiptValidation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import * as Yup from "yup";

interface FormErrors {
  [key: string]: string;
}

interface PreviewProps {
  values: ReceiptInput;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  stage: ReceiptOnlineStage | ReceiptStoreStage;
}
const Preview = ({ values, setFieldValue, stage }: PreviewProps) => {
  const [edit, setEdit] = useState(false);
  const [editState, setEditState] = useState<ReceiptInput>({} as ReceiptInput);
  const [errors, setErrors] = useState({
    store: "",
    amount: "",
    boughtDate: "",
    daysUntilReturn: "",
    trackingNumber: "",
  });
  useEffect(() => {
    setEditState(values);
  }, [values]);

  const toggleEdit = () => {
    if (!edit) {
      setEdit(true);
    }

    if (edit) {
      try {
        RECEIPT_SCHEMA.validateSync(editState, { abortEarly: false });

        Object.keys(editState).forEach((key) => {
          setFieldValue(key, editState[key as keyof ReceiptInput]);
          setErrors((prevState) => ({
            ...prevState,
            [key]: "",
          }));
        });
        setEdit(false);
      } catch (validationError) {
        if (validationError instanceof Yup.ValidationError) {
          const errors = validationError.inner.reduce((acc, curr) => {
            if (curr.path) {
              acc[curr.path] = curr.message;
            }
            return acc;
          }, {} as FormErrors);

          setErrors((prevState) => ({
            ...prevState,
            ...errors,
          }));
        }
        return;
      }
    }
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    let parsedValue = value;

    if (type === "number" || name === "daysUntilReturn") {
      const numericValue = parseInt(value, 10);
      parsedValue = isNaN(numericValue) ? "" : numericValue.toString();
      setEditState((prevState) => ({
        ...prevState,
        [name]: parsedValue,
      }));
    } else {
      setEditState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCurrencyChangeAmount = (value: string | undefined) => {
    setEditState((prevState) => ({
      ...prevState,
      amount: value || "",
    }));
  };

  // Adjusted to update editState for assetAmount similarly
  const handleCurrencyChangeAsset = (value: string | undefined) => {
    setEditState((prevState) => ({
      ...prevState,
      assetAmount: value || "",
    }));
  };
  return (
    <div className="flex flex-col gap-6 preview pb-[200px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <div className="flex gap-[100px]">
            <div className="flex flex-col gap-3 w-full">
              {edit ? (
                <div className="flex justify-between">
                  <input
                    className="text-orange-600 text-xl bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                    name="store"
                    value={editState.store}
                    onChange={handleEditChange}
                  />
                </div>
              ) : (
                <div className="flex justify-between">
                  <h1 className="text-orange-600 text-2xl">
                    {values.store || "Store Name"}
                  </h1>
                </div>
              )}
              {errors.store && (
                <p className="text-orange-900 text-sm">{errors.store}</p>
              )}
              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">TOTAL AMOUNT</h1>
                {edit ? (
                  <CurrencyInput
                    id="amount"
                    name="amount"
                    className="text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    placeholder=""
                    value={editState.amount}
                    defaultValue={editState.amount || ""}
                    decimalsLimit={2}
                    onValueChange={handleCurrencyChangeAmount}
                  />
                ) : values.amount ? (
                  <h1 className=" text-sm">{formatCurrency(values.amount)}</h1>
                ) : (
                  <h1 className="text-slate-600 text-sm">None</h1>
                )}
                {errors.amount && (
                  <p className="text-orange-900 text-sm">{errors.amount}</p>
                )}
              </div>
              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">ASSET AMOUNT</h1>
                {edit ? (
                  <CurrencyInput
                    id="assetAmount"
                    name="assetAmount"
                    className="text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    placeholder=""
                    value={editState.assetAmount}
                    defaultValue={editState.assetAmount || ""}
                    decimalsLimit={2}
                    onValueChange={handleCurrencyChangeAsset}
                  />
                ) : values.assetAmount ? (
                  <h1 className=" text-sm">
                    {formatCurrency(values.assetAmount)}
                  </h1>
                ) : (
                  <h1 className="text-slate-600 text-sm">None</h1>
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">CARD</h1>
                {edit ? (
                  <input
                    className=" text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    name="card"
                    value={editState.card}
                    onChange={handleEditChange}
                  />
                ) : values.card ? (
                  <h1 className=" text-sm">{values.card}</h1>
                ) : (
                  <h1 className="text-slate-600 text-sm">None</h1>
                )}
              </div>
              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">
                  TRACKING NUMBER LINK
                </h1>
                {edit ? (
                  <input
                    className=" text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    name="trackingNumber"
                    value={editState.trackingNumber}
                    onChange={handleEditChange}
                  />
                ) : values.trackingNumber ? (
                  <h1 className=" text-sm">{values.trackingNumber}</h1>
                ) : (
                  <h1 className="text-slate-600 text-sm">None</h1>
                )}
                {errors.trackingNumber && (
                  <p className="text-orange-900 text-sm">
                    {errors.trackingNumber}
                  </p>
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">PURCHASE DATE</h1>
                {edit ? (
                  <input
                    className=" text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    name="boughtDate"
                    value={editState.boughtDate}
                    onChange={handleEditChange}
                    type="date"
                  />
                ) : values.boughtDate ? (
                  <h1 className=" text-sm">{values.boughtDate}</h1>
                ) : (
                  <h1 className="text-orange-900 text-sm">
                    Purchase date is required
                  </h1>
                )}
              </div>
              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">DAYS UNTIL RETURN</h1>
                {edit ? (
                  <input
                    className=" text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    name="daysUntilReturn"
                    value={editState.daysUntilReturn}
                    onChange={handleEditChange}

                    // onChange={(event) => {
                    //   const value = parseInt(event.target.value, 10);
                    //   setFieldValue(
                    //     "daysUntilReturn",
                    //     isNaN(value) ? "" : value
                    //   );
                    // }}
                  />
                ) : values.daysUntilReturn ? (
                  <h1 className=" text-sm">{values.daysUntilReturn}</h1>
                ) : (
                  <h1 className="text-orange-900 text-sm">
                    Days until return is required
                  </h1>
                )}
                {errors.daysUntilReturn && (
                  <p className="text-orange-900 text-sm">
                    {errors.daysUntilReturn}
                  </p>
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">Return Date</h1>

                {values.boughtDate && values.daysUntilReturn && (
                  <h1 className=" text-sm">
                    {calculateReturnDate(
                      values.boughtDate,
                      values.daysUntilReturn
                    )}
                  </h1>
                )}
              </div>
            </div>
          </div>
          {/* {values.receiptImage && (
            <div className="w-[150px] h-[180px] overflow-hidden relative flex items-center justify-center rounded-sm">
              <Image
                width={150}
                height={150}
                src={values.receiptImage}
                alt=""
              />
              {edit && (
                <button
                  onClick={() => {
                    setFieldValue("receiptImage", "");
                  }}
                  type="button"
                  className="absolute top-0 right-0 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                >
                  X
                </button>
              )}
            </div>
          )} */}

          {stage !== ReceiptOnlineStage.PREVIEW && values.receiptImage && (
            <div className="w-[120px] h-[150px] flex items-center  flex-shrink-0 ">
              <div className="w-full">
                {edit ? (
                  <div className="text-sm">
                    {values.receiptImage && (
                      <div className=" relative flex items-center justify-center ">
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue("receiptImage", "");
                            setFieldValue("receiptImageFile", []);
                          }}
                          className="absolute top-0 right-0 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                        >
                          X
                        </button>
                        <Image
                          width={200}
                          height={200}
                          src={values.receiptImage}
                          alt=""
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Image
                    width={200}
                    height={200}
                    src={values.receiptImage}
                    alt=""
                    className="w-full h-full object-cover rounded-md"
                  />
                )}
              </div>
            </div>
          )}
          {stage !== ReceiptOnlineStage.PREVIEW && !values.receiptImage && (
            <div>
              {edit && (
                <div className="w-[120px] h-[150px] flex items-center  flex-shrink-0 ">
                  <div className="flex flex-col h-full w-full">
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (!file.type.match("image.*")) {
                            alert("Please upload an image file");
                            //  setUnvalidImage(true);
                            return;
                          }
                          const src = URL.createObjectURL(file);
                          setFieldValue("receiptImage", src);
                          setFieldValue("receiptImageFile", [file]);
                        }
                      }}
                      id="file-upload-item"
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                    />
                    <LargeButton height="h-full">
                      <label
                        htmlFor="file-upload-item"
                        className="w-full h-full flex justify-center items-center"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        Upload File
                      </label>
                    </LargeButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleEdit}
          className="text-sm text-orange-600 text-start"
        >
          {edit ? "Save" : "Edit"}
        </button>
      </div>

      <div className="w-full flex flex-col gap-4">
        {values.items.map((item, index) => (
          <div key={index}>
            <ReceiptFormItems
              item={item}
              index={index}
              setFieldValue={setFieldValue}
              values={values}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preview;
