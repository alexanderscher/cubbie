"use client";
import SubscribeModal from "@/components/Modals/SubscribeModal";
import SearchBar from "@/components/search/SearchBar";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AlertHeaderProps {
  planId?: number;
}

export const AlertHeader = ({ planId }: AlertHeaderProps) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (planId === 1) {
      setShowModal(true);
    }
  }, [planId]);
  return (
    <div className="flex flex-col gap-6 pb-8 w-full">
      <div className={` flex justify-between `}>
        <div className="cursor-pointer relative">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-emerald-900">Alerts</h1>
            <TooltipWithHelperIcon
              placement="right-start"
              content="Reminders for expiring receipts: We will notify you one week before, one day before, and on the day of expiration."
            />
          </div>
        </div>
      </div>
      {planId === 1 && (
        <div className="w-full">
          <input
            className="searchBar border-[1px] border-emerald-900 placeholder:text-emerald-900 placeholder:text-xs flex items-center text-sm text-emerald-900 p-3"
            placeholder={`Search alerts by store name`}
          />
        </div>
      )}
      {!planId && <SearchBar searchType="Alerts" />}
      {showModal && planId === 1 && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[20000]"
        >
          <div
            className={
              "bg-white rounded-lg shadow-xl m-4 max-w-md w-full flex justify-center"
            }
          >
            <SubscribeModal
              message="Subscribe to receive alerts about upcoming returns. Alerts will be
            displayed here and also emailed to you one week, one day, and on the
            actual day of your return"
            />
          </div>
        </div>
      )}
    </div>
  );
};
