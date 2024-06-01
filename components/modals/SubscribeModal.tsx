import RegularButton from "@/components/buttons/RegularButton";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

interface ErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

const SubscribeModal = () => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 z-[2000] flex justify-center items-center"
      onClick={(e) => e.preventDefault()}
    >
      <div className="relative p-10 bg-white  max-w-md m-auto flex-col flex  rounded-lg shadow-md gap-4 w-[340px] items-center ">
        <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
          <ExclamationTriangleIcon className=" text-orange-400 w-3/4 h-1/2" />
        </div>
        <h2 className="text-xl font-semibold text-orange-400 text-center">
          Upgrade.
        </h2>
        <div className="mt-3 text-sm text-orange-400 text-center">
          <p>
            Subscribe to receive alerts about upcoming returns. Alerts will be
            displayed here and also emailed to you one week, one day, and on the
            actual day of your return
          </p>
        </div>
        <div className="mt-4 flex w-full gap-4 justify-between">
          <RegularButton
            styles="px-4 py-2 bg-orange-400 text-white rounded-full border-[1px]   border-orange-400 w-full "
            href="/manage-plan"
          >
            Subscribe
          </RegularButton>
          <RegularButton
            styles="px-4 py-2  text-orange-400 rounded-full border-[1px]  border-orange-400 w-full"
            href="/"
          >
            Home
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
