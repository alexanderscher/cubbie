import React from "react";

const ReceiptManual = ({
  values,
  handleChange,
  setFieldValue,
  errors,
}: any) => {
  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-green-900">Store</p>

          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            name="store"
            value={values.store}
            onChange={handleChange("store")}
          />
          {errors.store && (
            <p className="text-orange-800 text-xs">{errors.store}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-green-900">Amount</p>
          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            name="amount"
            value={values.amount}
            onChange={handleChange("amount")}
          />
          {errors.amount && (
            <p className="text-orange-800 text-xs">{errors.amount}</p>
          )}
        </div>

        <div>
          <p className="text-sm text-green-900">Card</p>
          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            name="card"
            value={values.card}
            onChange={handleChange("card")}
          />
        </div>
        <div>
          <p className="text-sm text-green-900">Purchase Date</p>

          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            name="boughtDate"
            value={values.boughtDate}
            onChange={handleChange("boughtDate")}
            type="date"
          />
          {errors.boughtDate && (
            <p className="text-orange-800 text-xs">{errors.boughtDate}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-green-900">Number of days until return</p>

          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            value={values.daysUntilReturn}
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              setFieldValue("daysUntilReturn", isNaN(value) ? "" : value);
            }}
          />
          {errors.daysUntilReturn && (
            <p className="text-orange-800 text-xs">{errors.daysUntilReturn}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptManual;
