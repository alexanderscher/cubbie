import RegularButton from "@/app/components/buttons/RegularButton";
import React from "react";

interface ErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

const ErrorModal = ({ errorMessage, onClose }: ErrorModalProps) => {
  if (!errorMessage) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg border-emerald-900 border-[1.5px]">
        <h2 className="text-xl font-semibold">Error</h2>
        <div className="mt-3 text-sm text-gray-600">
          <p>{errorMessage}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <RegularButton
            handleClick={onClose}
            styles="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-full w-auto border-[1.5px] border-red-500"
          >
            Close
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
