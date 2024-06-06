"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const DiscardModal = ({
  setDiscardModal,
  leavePage,
}: {
  setDiscardModal: (value: boolean) => void;
  leavePage: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 z-[2000] flex justify-center items-center"
      onClick={(e) => e.preventDefault()}
    >
      <div className="relative p-10 bg-red-50  max-w-md m-auto flex-col flex  rounded-lg shadow-md gap-4 w-[340px] items-center ">
        <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
          <ExclamationTriangleIcon className=" text-red-500 w-3/4 h-1/2" />
        </div>
        <h2 className="text-xl font-semibold text-red-500">
          Warning: Unsaved Changes
        </h2>
        <div className="mt-3 text-sm text-red-500 text-center">
          <p>
            If you leave this page now, you will lose all entered data. Are you
            sure you want to leave?
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3 w-full ">
          <RegularButton
            handleClick={() => setDiscardModal(false)}
            styles="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-full w-auto border-[1px] text-xs  border-red-500 w-full"
          >
            Cancel
          </RegularButton>
          <RegularButton
            handleClick={() => leavePage()}
            styles="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-full w-auto border-[1px] text-xs  border-red-500 w-full"
          >
            Leave
          </RegularButton>
        </div>
      </div>
    </div>
  );
};
