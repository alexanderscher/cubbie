"use client";
import Filters from "@/components/headers/Filters";
import { Alert } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";

import React from "react";

interface AlertProps {
  alerts: Alert[];
}

const AlertComponent = ({ alerts }: AlertProps) => {
  console.log(alerts);
  return (
    <div>
      <AlertHeader />
      <div className="flex flex-col gap-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white p-6 rounded-md shadow">
            <div>{formatDateToMMDDYY(alert.date)}</div>
            <div>{alert.receipt.store}</div>
            <div>{alert.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertComponent;

const AlertHeader = () => {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className={` flex justify-between `}>
        <div className="cursor-pointer relative">
          <div className="flex gap-2 items-center ">
            <h1 className="text-2xl text-emerald-900">Alerts</h1>
          </div>
        </div>
      </div>

      <div className=" flex justify-between items-center relative flex-wrap gap-4 ">
        <div className="w-full">
          <input
            className="searchBar  border-[1px] border-emerald-900 placeholder:text-emerald-900 placeholder:text-xs flex items-center text-sm text-emerald-900 p-3"
            placeholder={`Search alerts by type, date, or store name`}

            // value={searchTerm}
            // onChange={handleChange}
          />
        </div>
      </div>
      <Filters />
    </div>
  );
};
