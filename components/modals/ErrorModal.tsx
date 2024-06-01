import RegularButton from "@/components/buttons/RegularButton";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

interface ErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

const ErrorModal = ({ errorMessage, onClose }: ErrorModalProps) => {
  if (!errorMessage) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 z-[2000] flex justify-center items-center"
      onClick={(e) => e.preventDefault()}
    >
      <div className="relative p-10 bg-red-50  max-w-md m-auto flex-col flex  rounded-lg shadow-md gap-4 w-[340px] items-center ">
        <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
          <ExclamationTriangleIcon className=" text-red-500 w-3/4 h-1/2" />
        </div>
        <h2 className="text-xl font-semibold text-red-500">Upload Error</h2>
        <div className="mt-3 text-sm text-red-500 text-center">
          <p>{errorMessage}</p>
        </div>
        <div className="mt-4 flex w-full ">
          <RegularButton
            handleClick={onClose}
            styles="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-full w-auto border-[1px] text-xs  border-red-500 w-full"
          >
            Close
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
