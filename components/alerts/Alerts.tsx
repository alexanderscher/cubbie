"use client";
import { Alert } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useTransition } from "react";
import { markAsRead, unmarkAsRead } from "@/actions/alerts/read";
import { toast } from "sonner";
import { deleteAlert } from "@/actions/alerts/deleteAlert";
import Loading from "@/components/Loading/Loading";
import { useSearchAlertContext } from "@/components/context/SearchFilterAlerts";
import { useSearchParams } from "next/navigation";
import { Overlay } from "@/components/overlays/Overlay";
import PageLoading from "@/components/Loading/PageLoading";
import moment from "moment";
import { AlertHeader } from "@/components/alerts/AlertHeader";

const describeDate = (dateString: string) => {
  const date = moment.utc(dateString, "MM/DD/YY");

  if (date.isSame(moment.utc(), "day")) {
    return "Today";
  }

  if (date.isSame(moment.utc().subtract(1, "days"), "day")) {
    return "1 day ago";
  }

  if (date.isSame(moment.utc().subtract(7, "days"), "day")) {
    return "1 week ago";
  }

  return date.format("MMMM DD, YYYY");
};
interface AlertProps {
  userId: string | undefined;
}

const AlertComponent = ({ userId }: AlertProps) => {
  const { filteredAlertData, isAlertLoading, fetchAlerts } =
    useSearchAlertContext();

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const searchParams = useSearchParams();

  const sortFieldParam = searchParams.get("sort");
  const sortField = sortFieldParam?.startsWith("-")
    ? sortFieldParam.slice(1)
    : sortFieldParam;
  const sortOrder = sortFieldParam?.startsWith("-") ? "desc" : "asc";

  const sortedAndFilteredData = useMemo(() => {
    if (!sortField) return filteredAlertData;

    return filteredAlertData.sort((a: Alert, b: Alert) => {
      let valueA: any, valueB: any;

      if (sortField === "alert_date") {
        valueA = a.date;
        valueB = b.date;
      } else {
        console.warn(`Sort field ${sortField} is not handled.`);
        return 0;
      }

      if (valueA === undefined || valueB === undefined) return 0;

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }, [filteredAlertData, sortField, sortOrder]);

  const unreadAlerts = filteredAlertData.map((alertObj) => {
    const isReadByUser = alertObj.readBy.some(
      (entry) => entry.userId === userId?.toString()
    );

    return (
      !isReadByUser && (
        <SingleAlert
          alertObj={alertObj}
          userId={userId}
          fetchAlerts={fetchAlerts}
        />
      )
    );
  });

  const readAlerts = filteredAlertData.map((alertObj) => {
    const isReadByUser = alertObj.readBy.some(
      (entry) => entry.userId === userId
    );

    return (
      isReadByUser && (
        <SingleAlert
          alertObj={alertObj}
          userId={userId}
          fetchAlerts={fetchAlerts}
        />
      )
    );
  });

  if (isAlertLoading) {
    return <PageLoading loading={isAlertLoading} />;
  }

  if (
    searchParams.get("alertType") === "all" ||
    !searchParams.get("alertType")
  ) {
    return (
      <div>
        <AlertHeader />
        {sortedAndFilteredData.length === 0 && !isAlertLoading && <NoAlerts />}
        <div className="flex flex-col gap-6">
          {sortedAndFilteredData.map((alertObj) => (
            <div key={alertObj.id}>
              <SingleAlert
                alertObj={alertObj}
                userId={userId}
                fetchAlerts={fetchAlerts}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (searchParams.get("alertType") === "unread") {
    return (
      <div>
        <AlertHeader />
        {sortedAndFilteredData.length === 0 && !isAlertLoading && <NoAlerts />}
        <div className="flex flex-col gap-6">{unreadAlerts}</div>
      </div>
    );
  }
  if (searchParams.get("alertType") === "read") {
    return (
      <div>
        <AlertHeader />
        {sortedAndFilteredData.length === 0 && !isAlertLoading && <NoAlerts />}
        <div className="flex flex-col gap-6">{readAlerts}</div>
      </div>
    );
  }
};

export default AlertComponent;

interface SingleAlertProps {
  alertObj: Alert;
  userId: string | undefined;
  fetchAlerts: () => void;
}

const SingleAlert = ({ alertObj, userId, fetchAlerts }: SingleAlertProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const isReadByUser = alertObj.readBy.some((entry) => entry.userId === userId);
  return (
    <div
      key={alertObj.id}
      className="relative bg-white p-4 rounded-lg shadow flex gap-8 items-center "
    >
      {isOpen && (
        <>
          <Overlay onClose={() => setIsOpen(false)} />
          <AlertOptionsModal
            alertObj={alertObj}
            userId={userId}
            fetchAlerts={fetchAlerts}
          />
        </>
      )}

      <div>
        <Image
          src="/notification_b.png"
          alt=""
          width={18}
          height={18}
          className="object-cover "
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div
        className={`flex flex-col gap-1 text-sm ${
          isReadByUser ? "text-slate-500" : ""
        }`}
      >
        {alertObj.type === "1_DAY_REMINDER" && (
          <p>
            Your receipt from{" "}
            <Link
              className={` ${
                isReadByUser ? "text-slate-500" : "text-emerald-900"
              } underline`}
              href={`/receipt/${alertObj.receiptId}`}
            >
              {alertObj.receipt.store}
            </Link>{" "}
            is due tomorrow
          </p>
        )}

        {alertObj.type === "TODAY_REMINDER" && (
          <p>
            Your receipt from{" "}
            <Link
              className={` ${
                isReadByUser ? "text-slate-500" : "text-emerald-900"
              } underline`}
              href={`/receipt/${alertObj.receiptId}`}
            >
              {alertObj.receipt.store}
            </Link>{" "}
            is due today
          </p>
        )}
        {alertObj.type === "1_WEEK_REMINDER" && (
          <p>
            Your receipt from{" "}
            <Link
              className={` ${
                isReadByUser ? "text-slate-500" : "text-emerald-900"
              } underline`}
              href={`/receipt/${alertObj.receiptId}`}
            >
              {alertObj.receipt.store}
            </Link>{" "}
            is due in one week
          </p>
        )}
        <div
          className={`text-xs ${
            isReadByUser ? "text-slate-500" : "text-orange-600"
          }`}
        >
          {describeDate(formatDateToMMDDYY(alertObj.date))}
          {/* {formatDateToMMDDYY(alertObj.date)} */}
        </div>
      </div>
      <Image
        src="/three-dots.png"
        className="absolute top-0 right-2 cursor-pointer "
        alt=""
        width={20}
        height={20}
        onClick={() =>
          setIsOpen((prev) => {
            return !prev;
          })
        }
      />
    </div>
  );
};

const AlertOptionsModal = ({
  alertObj,
  userId,
  fetchAlerts,
}: SingleAlertProps) => {
  const [isPending, startTransition] = useTransition();
  const isReadByUser = alertObj.readBy.some((entry) => entry.userId === userId);
  return (
    <div
      className={`absolute shadow-1 -right-2 top-10 rounded-lg w-[230px] bg-white p-4 z-[2000] text-sm`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer">
          {isReadByUser ? (
            <div
              className="flex gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startTransition(() => {
                  try {
                    unmarkAsRead({ alertID: alertObj.id });
                    fetchAlerts();
                  } catch (e) {
                    toast.error("An error occurred. Please try again.");
                  }
                });
              }}
            >
              <Image
                src={"/checkmark.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
              <p>Mark as unread</p>
            </div>
          ) : (
            <div
              className="flex gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startTransition(() => {
                  try {
                    markAsRead({ alertID: alertObj.id });
                    fetchAlerts();
                  } catch (e) {
                    toast.error("An error occurred. Please try again.");
                  }
                });
              }}
            >
              <Image
                src={"/checkmark.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
              <p>Mark as read</p>
            </div>
          )}
        </div>
        <div className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer">
          <div
            className="flex gap-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startTransition(() => {
                try {
                  deleteAlert({ alertID: alertObj.id });
                  fetchAlerts();
                } catch (e) {
                  toast.error("An error occurred. Please try again.");
                }
              });
            }}
          >
            <Image src={"/xmark.png"} width={20} height={20} alt=""></Image>
            <p>Remove notification</p>
          </div>
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

const NoAlerts = () => {
  return (
    <div className="w-full flex justify-center flex-col items-center gap-5 mt-20">
      <Image
        src="/notification_b.png"
        alt=""
        width={50}
        height={50}
        className="object-cover "
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      <h1 className="text-xl">No alerts</h1>
    </div>
  );
};
