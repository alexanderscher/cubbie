import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import { ReceiptInput } from "@/types/formTypes/form";
import { calculateReturnDate } from "@/utils/calculateReturnDate";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";

interface PreviewProps {
  values: ReceiptInput;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleChange: any;
}
const Preview = ({ values, setFieldValue, handleChange }: PreviewProps) => {
  const [edit, setEdit] = useState(false);

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const handleCurrencyChange = (value: string | undefined) => {
    setFieldValue("amount", value || "");
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
                    value={values.store}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <div className="flex justify-between">
                  <h1 className="text-orange-600 text-2xl">
                    {values.store || "Store Name"}
                  </h1>
                </div>
              )}
              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">TOTAL AMOUNT</h1>
                {edit ? (
                  <CurrencyInput
                    id="amount"
                    name="amount"
                    className="text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    placeholder=""
                    value={values.amount}
                    defaultValue={values.amount || ""}
                    decimalsLimit={2}
                    onValueChange={handleCurrencyChange}
                  />
                ) : (
                  <h1 className=" text-sm">{formatCurrency(values.amount)}</h1>
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">CARD</h1>
                {edit ? (
                  <input
                    className=" text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    name="card"
                    value={values.card}
                    onChange={handleChange}
                  />
                ) : (
                  <h1 className=" text-sm">{values.card}</h1>
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
                    value={values.trackingNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <h1 className=" text-sm">{values.trackingNumber}</h1>
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">PURCHASE DATE</h1>
                {edit ? (
                  <input
                    className=" text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    name="boughtDate"
                    value={values.boughtDate}
                    onChange={handleChange}
                    type="date"
                  />
                ) : (
                  <h1 className=" text-sm">{values.boughtDate}</h1>
                )}
              </div>
              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">DAYS UNTIL RETURN</h1>
                {edit ? (
                  <input
                    className=" text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    name="daysUntilReturn"
                    value={values.daysUntilReturn}
                    onChange={(event) => {
                      const value = parseInt(event.target.value, 10);
                      setFieldValue(
                        "daysUntilReturn",
                        isNaN(value) ? "" : value
                      );
                    }}
                  />
                ) : (
                  values.boughtDate &&
                  values.daysUntilReturn && (
                    <h1 className=" text-sm">{values.daysUntilReturn}</h1>
                  )
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-400  text-sm">Return Date</h1>
                {edit ? (
                  <input
                    className=" text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none"
                    name="finalReturnDate"
                    type="date"
                  />
                ) : (
                  values.boughtDate &&
                  values.daysUntilReturn && (
                    <h1 className=" text-sm">
                      {calculateReturnDate(
                        values.boughtDate,
                        values.daysUntilReturn
                      )}
                    </h1>
                  )
                )}
              </div>
            </div>
          </div>
          {values.receiptImage && (
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
