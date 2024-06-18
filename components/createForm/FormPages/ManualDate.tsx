"use client";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import React from "react";

interface ManualDateProps {
  values: any;
  handleChange: any;
  errors?: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  comingfrom?: string;
}

const ManualDate = ({
  values,
  handleChange,
  setFieldValue,
  comingfrom,
}: ManualDateProps) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-2 w-full">
        {comingfrom !== "gpt" && (
          <div className="w-1/2">
            <p className="text-sm text-emerald-900 ">Purchase Date</p>
            <div className="flex flex-col gap-2">
              <input
                className="w-full border-[1px] bg  p-2  border-emerald-900 rounded  focus:outline-none cursor-pointer"
                name="purchase_date"
                value={values.purchase_date}
                onChange={handleChange("purchase_date")}
                type="date"
                style={{ WebkitAppearance: "none" }}
              />
              {/* {errors.purchase_date && (
              <p className="text-orange-800 text-sm">{errors.purchase_date}</p>
            )} */}
            </div>
          </div>
        )}
        <div className={comingfrom === "gpt" ? "w-full" : "w-1/2"}>
          <p className="text-sm text-emerald-900 ">Days until return</p>

          <input
            className="w-full border-[1px] bg  p-2  border-emerald-900 rounded  focus:outline-none "
            value={values.days_until_return}
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              setFieldValue("days_until_return", isNaN(value) ? "" : value);
            }}
          />
          {/* {errors.days_until_return && (
            <p className="text-orange-800 text-sm">
              {errors.days_until_return}
            </p>
          )} */}
        </div>
      </div>

      {comingfrom !== "gpt" && (
        <div>
          <p className="text-emerald-900 text-sm">Return Date</p>
          <div className="w-full border-[1px] bg  p-2  border-emerald-900 rounded  focus:outline-none ">
            {formatDateToMMDDYY(
              calculateReturnDate(
                values.purchase_date,
                values.days_until_return
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualDate;
