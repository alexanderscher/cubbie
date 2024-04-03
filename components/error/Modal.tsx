import RegularButton from "@/components/buttons/RegularButton";
import React from "react";

interface ErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

const ErrorModal = ({ errorMessage, onClose }: ErrorModalProps) => {
  if (!errorMessage) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-auto bg-smoke-light flex">
      <div className="relative p-6 bg-red-200 w-full max-w-md m-auto flex-col flex rounded-md  shadow-md">
        <h2 className="text-xl font-semibold text-red-500">Error</h2>
        <div className="mt-3 text-sm text-emerald-900">
          <p>{errorMessage}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <RegularButton
            handleClick={onClose}
            styles="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-full w-auto border-[1px] text-xs  border-red-500"
          >
            Close
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
