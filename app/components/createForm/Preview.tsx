import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import { ReceiptInput } from "@/types/formTypes/form";
import { calculateReturnDate } from "@/utils/calculateReturnDate";
import Image from "next/image";
import React, { useState } from "react";

interface PreviewProps {
  values: ReceiptInput;
  setFieldValue: any;
  handleChange: any;
}
const Preview = ({ values, setFieldValue, handleChange }: PreviewProps) => {
  const [edit, setEdit] = useState(false);

  const toggleEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className="flex flex-col gap-6 preview pb-[200px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 ">
            {edit ? (
              <div className="flex justify-between">
                <input
                  className="text-green-900 text-xl bg-white border-b-[1.5px] bg border-green-900 w-full"
                  name="store"
                  value={values.store}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="text-sm text-orange-400"
                >
                  {edit ? "Save" : "Edit"}
                </button>
              </div>
            ) : (
              <div className="flex justify-between">
                <h1 className="text-green-900 text-2xl">
                  {values.store || "Store Name"}
                </h1>
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="text-sm text-orange-400"
                >
                  {edit ? "Save" : "Edit"}
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex flex-col ">
                <h1 className="text-slate-500 font-bold text-sm">
                  Total Amount
                </h1>
                {edit ? (
                  <input
                    className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-green-900"
                    name="amount"
                    value={values.amount as number}
                    onChange={handleChange}
                  />
                ) : (
                  <h1 className="text-green-900 text-sm">{values.amount}</h1>
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-500 font-bold text-sm">Card</h1>
                {edit ? (
                  <input
                    className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-green-900"
                    name="card"
                    value={values.card}
                    onChange={handleChange}
                  />
                ) : (
                  <h1 className="text-green-900 text-sm">{values.card}</h1>
                )}
              </div>
              <div className="flex flex-col ">
                <h1 className="text-slate-500 font-bold text-sm">
                  Tracking Number Link
                </h1>
                {edit ? (
                  <input
                    className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-green-900"
                    name="trackingNumber"
                    value={values.trackingNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <h1 className="text-green-900 text-sm">
                    {values.trackingNumber}
                  </h1>
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-500 font-bold text-sm">
                  Purchase Date
                </h1>
                {edit ? (
                  <input
                    className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-green-900"
                    name="boughtDate"
                    value={values.boughtDate}
                    onChange={handleChange}
                    type="date"
                  />
                ) : (
                  <h1 className="text-green-900 text-sm">
                    {values.boughtDate}
                  </h1>
                )}
              </div>
              <div className="flex flex-col ">
                <h1 className="text-slate-500 font-bold text-sm">
                  Days until return
                </h1>
                {edit ? (
                  <input
                    className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-green-900"
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
                    <h1 className="text-green-900 text-sm">
                      {values.daysUntilReturn}
                    </h1>
                  )
                )}
              </div>

              <div className="flex flex-col ">
                <h1 className="text-slate-500 font-bold text-sm">
                  Return Date
                </h1>
                {edit ? (
                  <input
                    className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-green-900"
                    name="finalReturnDate"
                    type="date"
                  />
                ) : (
                  values.boughtDate &&
                  values.daysUntilReturn && (
                    <h1 className="text-green-900 text-sm">
                      {calculateReturnDate(
                        values.boughtDate,
                        values.daysUntilReturn
                      )}
                    </h1>
                  )
                )}
              </div>
            </div>
            {values.receiptImage && values.receiptImage.length > 0 && (
              <div className="w-24 h-50 overflow-hidden relative flex items-center justify-center rounded-md">
                <Image
                  width={150}
                  height={150}
                  src={values.receiptImage[0].url}
                  alt=""
                />
              </div>
            )}
          </div>
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
    </div>
  );
};

export default Preview;
