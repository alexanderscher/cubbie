"use client";
import Filters from "@/components/headers/Filters";
import { Alert } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { format, parse, isToday, isYesterday, subDays } from "date-fns";

const describeDate = (dateString: string) => {
  const date = parse(dateString, "MM/dd/yy", new Date());

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  const oneWeekAgo = subDays(new Date(), 7);
  if (format(date, "MM/dd/yyyy") === format(oneWeekAgo, "MM/dd/yyyy")) {
    return "One week ago";
  }

  return format(date, "MMMM dd, yyyy");
};

interface AlertProps {
  alerts: Alert[];
}

const AlertComponent = ({ alerts }: AlertProps) => {
  return (
    <div>
      <AlertHeader />
      <div className="flex flex-col gap-6">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white p-6 rounded-md shadow flex gap-4 items-center"
          >
            <div>
              <Image
                src="/notification_b.png"
                alt=""
                width={25}
                height={25}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              {alert.type === "1_DAY_REMINDER" && (
                <p>
                  Your receipt from{" "}
                  <Link href={`/receipt/${alert.receipt_id}`}>
                    {alert.receipt.store}
                  </Link>{" "}
                  is due tomorrow
                </p>
              )}
              {alert.type === "TODAY_REMINDER" && (
                <p>
                  Your receipt from{" "}
                  <Link href={`/receipt/${alert.receipt_id}`}>
                    {alert.receipt.store}
                  </Link>{" "}
                  is due today
                </p>
              )}
              {alert.type === "1_WEEK_REMINDER" && (
                <p>
                  Your receipt from{" "}
                  <Link href={`/receipt/${alert.receipt_id}`}>
                    {alert.receipt.store}
                  </Link>{" "}
                  is due in one week
                </p>
              )}
              <div className="text-sm">
                {describeDate(formatDateToMMDDYY(alert.date))}
              </div>
            </div>
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
