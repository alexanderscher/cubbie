"use client";
import Filters from "@/components/headers/Filters";
import { Alert } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import Link from "next/link";
import React, { useTransition } from "react";
import { format, parse, isToday, isYesterday, subDays } from "date-fns";
import { markAsRead, unmarkAsRead } from "@/actions/alerts/read";
import { toast } from "sonner";
import { deleteAlert } from "@/actions/alerts/deleteAlert";

const describeDate = (dateString: string) => {
  const date = parse(dateString, "MM/dd/yy", new Date());

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "1 day ago";
  }

  const oneWeekAgo = subDays(new Date(), 7);
  if (format(date, "MM/dd/yyyy") === format(oneWeekAgo, "MM/dd/yyyy")) {
    return "1 week ago";
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
        {alerts.map((alertObj) => (
          <>
            <SingleAlert alertObj={alertObj} />
          </>
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

interface SingleAlertProps {
  alertObj: Alert;
}

const SingleAlert = ({ alertObj }: SingleAlertProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      key={alertObj.id}
      className="relative bg-white p-4 rounded-md shadow flex gap-8 items-center "
    >
      {isOpen && (
        <>
          <Overlay onClose={() => setIsOpen(false)} />
          <AlertOptionsModal alertObj={alertObj} />
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
          alertObj.read && "text-slate-500"
        }`}
      >
        {alertObj.type === "1_DAY_REMINDER" && (
          <p>
            Your receipt from{" "}
            <Link href={`/receipt/${alertObj.receipt_id}`}>
              {alertObj.receipt.store}
            </Link>{" "}
            is due tomorrow
          </p>
        )}
        {alertObj.type === "TODAY_REMINDER" && (
          <p>
            Your receipt from{" "}
            <Link href={`/receipt/${alertObj.receipt_id}`}>
              {alertObj.receipt.store}
            </Link>{" "}
            is due today
          </p>
        )}
        {alertObj.type === "1_WEEK_REMINDER" && (
          <p>
            Your receipt from{" "}
            <Link href={`/receipt/${alertObj.receipt_id}`}>
              {alertObj.receipt.store}
            </Link>{" "}
            is due in one week
          </p>
        )}
        <div
          className={`text-xs ${
            alertObj.read ? "text-slate-500" : "text-orange-600"
          }`}
        >
          {describeDate(formatDateToMMDDYY(alertObj.date))}
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

const AlertOptionsModal = ({ alertObj }: SingleAlertProps) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div
      className={`absolute shadow-1 -right-2 top-10 rounded-md w-[230px] bg-white p-4 z-[201] text-sm`}
      onClick={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-2">
        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2 cursor-pointer">
          {alertObj.read ? (
            <div
              className="flex gap-2"
              onClick={(e) => {
                e.preventDefault();
                startTransition(() => {
                  try {
                    unmarkAsRead({ alertID: alertObj.id });
                    toast.success("Your operation was successful!");
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
                startTransition(() => {
                  try {
                    markAsRead({ alertID: alertObj.id });
                    toast.success("Your operation was successful!");
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
        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2 cursor-pointer">
          <div
            className="flex gap-2"
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                try {
                  deleteAlert({ alertID: alertObj.id });
                  toast.success("Your operation was successful!");
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
    </div>
  );
};

interface OverlayProps {
  onClose: () => void;
}

const Overlay = ({ onClose }: OverlayProps) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      onClose();
    }
  };
  return (
    <div
      id="modal-overlay"
      className={`filter-overlay`}
      onClick={handleOverlayClick}
    ></div>
  );
};
